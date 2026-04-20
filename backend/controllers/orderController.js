import mongoose from "mongoose";
import Order from "../models/orderSchema.js";

export const getPublicOrder = async (req, res) => {
  try {
    const { id } = req.params;

 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    
    const order = await Order.findById(id).select(
      "_id createdAt userName items totalAmount address"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);

  } catch (err) {
    console.error("Public order fetch error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};