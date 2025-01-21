import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    claimHistory: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Claim",
        },
      ],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
