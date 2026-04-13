import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  category: String,
  flavours: [String],
  addons: [
    {
      name: String,
      price: Number
    }
  ]
});

export default mongoose.model("Category", categorySchema);