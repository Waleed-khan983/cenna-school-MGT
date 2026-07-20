import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    section: { type: String, default: "A", trim: true },
    displayName: { type: String, trim: true },

    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },



    room: { type: String, trim: true },
    capacity: { type: Number, default: 50 },
    isActive: { type: Boolean, default: true },

    // Optional — most classes have none (the "current" class for a name
    // + section) and that must keep working exactly as-is. When set, it
    // distinguishes historical copies of the same name + section across
    // academic years (see the Tier 6B report: real deployed documents
    // already use this for exactly that, which is why the compound index
    // below was already live in the database before this field existed
    // in the schema — this formalizes it, it does not create anything new).
    academicYear: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => !value || /^\d{4}-\d{4}$/.test(value),
        message: "academicYear must be in YYYY-YYYY format",
      },
    },
  },
  { timestamps: true }
);

// Matches the index already deployed on the classes collection exactly
// (name + section + academicYear, unique) — declaring it here just makes
// it visible to schema-vs-deployed drift detection (utils/indexSync.js).
// Since every field/option matches what's already live, mongoose's normal
// index sync at boot is a no-op: nothing gets dropped or rebuilt.
ClassSchema.index(
  { name: 1, section: 1, academicYear: 1 },
  { unique: true }
);

ClassSchema.pre("save", function (next) {
  this.displayName = `${this.name} - ${this.section}`;
  next();
});

ClassSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.name || update.section) {
    const name = update.name;
    const section = update.section || "A";

    if (name) {
      update.displayName = `${name} - ${section}`;
    }
  }

  next();
});

const Class = mongoose.models.Class || mongoose.model("Class", ClassSchema);

export default Class;