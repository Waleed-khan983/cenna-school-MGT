import Counter from "../models/counter.js";

// Atomically returns the next number in a named sequence. A single $inc on
// one document is atomic on its own (no transaction required for safety),
// but still accepts an existing session so it can participate in a larger
// transaction (e.g. teacher creation) when one is already open.
export const getNextSequence = async (name, session = null) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, session },
  );

  return counter.seq;
};

// Extracts the highest numeric suffix from a list of "PREFIX-000123"-style
// strings. Used only to seed a counter's starting point from pre-existing
// historical data, so newly generated identifiers never collide with ones
// that were assigned before this counter existed.
const maxNumericSuffix = (values, prefixPattern) => {
  let max = 0;

  for (const value of values) {
    const match = typeof value === "string" && value.match(prefixPattern);

    if (match) {
      const n = Number(match[1]);

      if (Number.isFinite(n) && n > max) {
        max = n;
      }
    }
  }

  return max;
};

// Idempotent: only computes and writes a starting value the first time this
// counter is ever used (checked via a plain findById, then an upsert that
// only takes effect on insert via $setOnInsert). Safe to call on every
// server boot — a no-op once the counter document exists.
const ensureCounterSeeded = async (name, computeStartValue) => {
  const existing = await Counter.findById(name);

  if (existing) return;

  const startValue = await computeStartValue();

  await Counter.updateOne(
    { _id: name },
    { $setOnInsert: { seq: startValue } },
    { upsert: true },
  );
};

// Called once at server startup (see server.js). Seeds every
// atomically-generated identifier's counter from whatever historical data
// already exists, so the first newly-generated value can never collide with
// something assigned before this system existed.
export const seedIdentifierCounters = async () => {
  const Teacher = (await import("../models/teacher.js")).default;
  const Admission = (await import("../models/admission.js")).default;

  await ensureCounterSeeded("teacherEmployeeId", async () => {
    const teachers = await Teacher.find().select("employeeId").lean();
    return maxNumericSuffix(
      teachers.map((t) => t.employeeId),
      /^TCH-(\d+)$/,
    );
  });

  await ensureCounterSeeded("admissionRefNo", async () => {
    const admissions = await Admission.find().select("refNo").lean();
    return maxNumericSuffix(
      admissions.map((a) => a.refNo),
      /^CSP-\d{4}-(\d+)$/,
    );
  });

  // Fee challanNo/receiptNo have no consistent historical numeric sequence
  // to preserve (existing values are a mix of a short-lived "CH-001" scheme
  // and raw millisecond timestamps — see Tier 4 report) — both counters
  // start fresh at 0, which is safe because the new format ("CHN-000123",
  // "RCPT-000123") is structurally distinct from every historical value.
  await ensureCounterSeeded("feeChallanNo", async () => 0);
  await ensureCounterSeeded("feeReceiptNo", async () => 0);
};
