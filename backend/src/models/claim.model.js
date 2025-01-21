import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pointsClaimed: {
      type: Number,
    },
  },
  { timestamps: true }
);

export const Claim = mongoose.model("CLAIM", claimSchema);
