import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

email: {
  type: String,
  unique: true,
  sparse: true,
  lowercase: true,
  trim: true,
  index: true,
  match: [/^\S+@\S+\.\S+$/, "Invalid email"],
},

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "admin",
        "teacher",
        "student",
        "parent",
        "coordinator",
        "accountant",
        "operator",
        "alumni",
      ],
      required: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLogin: {
      type: Date,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

/// ─────────────────────────────────────────────
//  PASSWORD HASHING
/// ─────────────────────────────────────────────
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/// ─────────────────────────────────────────────
//  COMPARE PASSWORD
/// ─────────────────────────────────────────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/// ─────────────────────────────────────────────
//  JWT TOKEN GENERATION
/// ─────────────────────────────────────────────
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};


const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;