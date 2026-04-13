import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  userName: {
    type: String,
    required: true
  },

  userPhone: {
    type: String,
    required: true
  },

  items: [
    {
      name: {
        type: String,
        required: true
      },

      price: {
        type: Number,
        required: true
      },

      qty: {
        type: Number,
        required: true
      },

      selectedFlavour: {
        type: String
      },

      addon: {
        name: String,
        price: Number
      }
    }
  ],

  address: {
    type: String,
    required: true
  },

  subtotal: {
    type: Number,
    required: true
  },

  deliveryCharge: {
    type: Number,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order =  mongoose.model("Order", orderSchema);
export default Order;