import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
  userDid: {
    type: String,
  },
  pfiDid: {
    type: String,
  },
  status: {
    type: "success" || "failed",
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

const PFISchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  did: {
    type: String,
    unique: true,
  },
  orders: [OrderSchema],
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    immutable: true,
  },
});

const PFI = mongoose.models.PFI || mongoose.model("PFI", PFISchema);
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export { PFI, Order };
