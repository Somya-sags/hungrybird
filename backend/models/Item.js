import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  name: String,
  price: Number,
  type: String
});

export default mongoose.model("Item", itemSchema);