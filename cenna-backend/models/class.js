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
  },
  { timestamps: true }
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