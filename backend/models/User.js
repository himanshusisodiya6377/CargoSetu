const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

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
     photoPublicId: {
     type: String,
     },
    role: {
      type: String,
      enum: ["Admin", "Sender", "Driver"],
      default: "Driver",
    },
    vehicleType: String,
    capacity: Number,
    licenseNumber: String,
    commissionBalance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});


module.exports = mongoose.model("User", userSchema);
