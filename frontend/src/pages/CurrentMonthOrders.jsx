import { useState,useEffect } from "react";
import axios from "axios";
import logo from "../assets/images/hblogo.jpeg"

export default function CurrentMonthOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/orders/my-month-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-lg font-semibold text-orange-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Orders This Month</h1>
            <p className="mt-2 text-gray-500">
              All orders placed in the current month are shown below.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4 mb-4">
          <p className="text-sm font-medium text-gray-600">
            Call this number to confirm your order:
          </p>

          <a
            href="tel:+918895292321"
            className="mt-2 block text-lg font-bold text-orange-600 select-text"
          >
            +91 8895292321
          </a>

          <p className="mt-1 text-xs text-gray-500">
            Press and hold the number to copy it.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-lg text-gray-500">No orders found for this month.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg"
              >
                <div className="mb-5 flex flex-col gap-4 border-b border-orange-100 pb-4 md:flex-row md:items-center md:justify-between">

                    {/* LEFT: Logo + Order ID */}
                    <div className="flex items-center gap-4">
                      <img
                        src={logo}
                        alt="Cafe Logo"
                        className="h-12 w-12 rounded-full object-cover border border-gray-200 shadow-sm"
                      />

                      <div>
                        <p className="text-sm font-medium text-gray-500">Order ID</p>
                        <p className="font-semibold text-gray-800">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT: Date + Share */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

                      {/* Date */}
                      <div className="text-left md:text-right">
                        <p className="text-sm font-medium text-gray-500">Placed On</p>
                        <p className="font-semibold text-gray-800">
                          {formatDateTime(order.createdAt)} IST
                        </p>
                      </div>


                    </div>
                  </div>

                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-orange-100 bg-orange-50 p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>

                          <p className="mt-1 text-sm text-gray-600">
                            Quantity: <span className="font-medium">{item.qty}</span>
                          </p>

                          {item.selectedFlavour && (
                            <p className="mt-1 text-sm text-gray-600">
                              Flavour: <span className="font-medium">{item.selectedFlavour}</span>
                            </p>
                          )}

                          {item.addon?.name && (
                            <p className="mt-1 text-sm text-gray-600">
                              Add-on: <span className="font-medium">{item.addon.name}</span>
                              {" "}(+₹{item.addon.price})
                            </p>
                          )}
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-500">Item Total</p>
                          <p className="text-xl font-bold text-orange-600">
                            ₹
                            {(item.price * item.qty) + (item.addon?.price || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <div className="mb-2 flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>

                  <div className="mb-2 flex justify-between text-gray-700">
                    <span>Delivery Charges</span>
                    <span>₹{order.deliveryCharge}</span>
                  </div>

                  <div className="border-t border-orange-200 pt-3 flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-orange-600">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
