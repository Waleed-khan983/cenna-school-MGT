import mongoose from "mongoose";

// Backing store for every atomically-generated, human-readable identifier
// in the app (teacher employee IDs, admission reference numbers, fee
// challan/receipt numbers). One document per identifier "name", incremented
// via a single atomic $inc — safe under concurrency without needing a
// transaction of its own, and safe to include inside a larger transaction
// via the {session} option when one is already open.
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export default Counter;
