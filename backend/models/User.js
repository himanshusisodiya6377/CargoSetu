const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    photo: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
    },
    role: {
      type: String,
      enum: ["Admin", "Sender", "Driver"],
      default: "Driver",
    },
    vehicleType: String,
    capacity: Number,
    licenseNumber: String,
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    jobsCompleted: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    commissionBalance: {
      type: Number,
      default: 0,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


module.exports = mongoose.model("User", userSchema);
