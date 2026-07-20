import mongoose from "mongoose";

// Detects index drift between what a model's schema currently defines and
// what's actually deployed on the collection — e.g. the Attendance
// collection had a stale 3-field unique index left over from before
// `period` was added to the compound key, which silently blocked marking
// more than one period per subject/day (see Tier 6A report).
//
// `autoIndex` (on by default in mongoose) only ever ADDS indexes that are
// in the schema but missing from the collection — it never drops an index
// that's deployed but no longer in the schema. That's exactly the gap that
// let the Attendance drift go unnoticed. This function does not touch any
// index — dropping a live index automatically on every boot is its own
// production risk (could catch a legitimate manually-added index, or
// contend with another instance mid-deploy). It only logs a clear warning
// so drift is caught immediately instead of silently, and the same
// explicit, reviewed `dropIndex` migration used for Attendance can be
// applied deliberately.
export async function checkIndexDrift() {
  const modelNames = mongoose.modelNames();

  for (const name of modelNames) {
    const model = mongoose.model(name);

    let deployedIndexes;
    try {
      deployedIndexes = await model.collection.indexes();
    } catch (err) {
      // Collection doesn't exist yet (e.g. fresh DB, no documents written
      // for this model) — nothing to compare.
      continue;
    }

    const schemaIndexKeys = model.schema
      .indexes()
      .map(([keys]) => JSON.stringify(keys));

    const deployedNonIdIndexes = deployedIndexes.filter(
      (idx) => idx.name !== "_id_"
    );

    for (const deployed of deployedNonIdIndexes) {
      const deployedKeyStr = JSON.stringify(deployed.key);
      const definedInSchema = schemaIndexKeys.includes(deployedKeyStr);

      // Single-field indexes declared via `index: true` on a schema path
      // (not `schema.index()`) won't show up in `schema.indexes()` above,
      // so only flag multi-field (compound) indexes as drift candidates —
      // those are always declared via an explicit `schema.index()` call.
      const isCompound = Object.keys(deployed.key).length > 1;

      if (isCompound && !definedInSchema) {
        console.warn(
          `⚠️  Index drift: "${name}" collection has deployed index "${deployed.name}" ` +
            `(${deployedKeyStr}) that is not defined in the current schema. ` +
            `If this is stale, drop it explicitly with a reviewed migration — do not auto-drop.`
        );
      }
    }
  }
}
