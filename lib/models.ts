import mongoose from "mongoose";

const { Schema } = mongoose;

const PFISchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  did: {
    type: String,
    unique: true,
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  successfulOrders: {
    type: Number,
    default: 0,
  },
  failedOrders: {
    type: Number,
    default: 0,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    immutable: true,
  },
});

const UserRatingSchema = new Schema({
  pfiDid: {
    type: String,
  },
  userDid: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
  },
});

const PFI = mongoose.models.PFI || mongoose.model("PFI", PFISchema);
const UserRating =
  mongoose.models.UserRating || mongoose.model("UserRating", UserRatingSchema);

export { PFI, UserRating };
