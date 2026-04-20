import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js"
import { userSignup,userLogin, userLogout, getMe } from "./controllers/authController.js";
import Category from "./models/Category.js";
import Item from "./models/Item.js";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { adminMiddleware } from "./middleware/adminMiddleware.js"
import Order from "./models/orderSchema.js";
import { getPublicOrder } from "./controllers/orderController.js";


dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: [
    "http://localhost:5173", // local
    "https://hungrybird.cc",
    "https://www.hungrybird.cc"
  ]
}));
app.use(express.json());
app.use("/api/auth",authRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.post("/signup",userSignup);
app.post("/login",userLogin);
app.post("/logout",authMiddleware,userLogout);
app.get("/me",authMiddleware,getMe);

app.post("/api/categories/bulk", async (req, res) => {
  try {
    const saved = await Category.insertMany(req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/api/items/bulk", async (req, res) => {
  try {
    const saved = await Item.insertMany(req.body);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/categories", async (req, res) => {
  const data = await Category.find();
  res.json(data);
});

app.get("/api/menu", async (req, res) => {
  try {
    const categories = await Category.find();

    const items = await Item.find();

    res.json({ categories, items });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/orders", authMiddleware, async (req, res) => {
  try {
    const { items, address, subtotal, deliveryCharge, totalAmount } = req.body;

    const order = new Order({
      userId: req.user.userId,
      userName: req.user.name,
      userPhone: req.user.phone,
      items,
      address,
      subtotal,
      deliveryCharge,
      totalAmount
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not save order" });
  }
});

app.get("/orders/my-month-orders", authMiddleware, async (req, res) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const orders = await Order.find({
      userId: req.user.userId,
      createdAt: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.get(
  "/admin/orders/today",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const now = new Date();

      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      const orders = await Order.find({
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      }).sort({ createdAt: -1 });

      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch today's orders" });
    }
  }
);


app.get(
  "/orders/admin-month-orders",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const now = new Date();

      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      );

      const orders = await Order.find({
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      }).sort({ createdAt: -1 });

      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch monthly orders" });
    }
  }
);

app.get("/orders/public/:id", getPublicOrder);