import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/admin/orders/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to fetch today's orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTodayOrders();
  }, []);

  const formatISTDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="rounded-3xl bg-white px-8 py-6 shadow-lg">
          <p className="text-lg font-semibold text-orange-600">
            Loading today's orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 px-4">
        <div className="rounded-3xl border border-red-100 bg-white px-8 py-6 shadow-lg">
          <p className="text-lg font-semibold text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              Today's Orders
            </h1>
            <p className="mt-2 text-gray-500">
              Latest orders appear first.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/admin/menu")}
              className="rounded-2xl border border-orange-100 bg-white px-6 py-4 font-semibold text-orange-600 shadow-md transition hover:bg-orange-50 hover:shadow-lg"
            >
              Edit Menu
            </button>

            <button
              onClick={() => navigate("/admin/month-orders")}
              className="rounded-2xl bg-orange-500 px-6 py-4 font-semibold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg"
            >
              Show Month Orders
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg border border-orange-100">
            <p className="text-lg font-semibold text-gray-500">
              No orders have been placed today.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl"
              >
                <div className="border-b border-orange-100 bg-orange-500 px-6 py-5 text-white">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-orange-100">
                        Order ID
                      </p>
                      <h2 className="mt-1 text-xl font-bold">#{order._id}</h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <p className="text-sm text-orange-100">Customer</p>
                        <p className="font-semibold">{order.userName}</p>
                      </div>

                      <div>
                        <p className="text-sm text-orange-100">Contact Number</p>
                        <p className="font-semibold">{order.userPhone}</p>
                      </div>

                      <div>
                        <p className="text-sm text-orange-100">Placed At</p>
                        <p className="font-semibold">{formatISTDate(order.createdAt)} IST</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Delivery Address
                    </p>
                    <p className="text-gray-800 leading-7">{order.address}</p>
                  </div>

                  <div>
                    <h3 className="mb-4 text-xl font-bold text-gray-800">Ordered Items</h3>

                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">
                                {item.name}
                              </h4>

                              <p className="mt-2 text-gray-600">
                                Quantity: <span className="font-semibold">{item.qty}</span>
                              </p>

                              {item.selectedFlavour && (
                                <p className="mt-1 text-gray-600">
                                  Flavour: <span className="font-semibold">{item.selectedFlavour}</span>
                                </p>
                              )}

                              {item.addon?.name && (
                                <p className="mt-1 text-gray-600">
                                  Add-on: <span className="font-semibold">{item.addon.name}</span>
                                  <span className="text-orange-600"> (+₹{item.addon.price})</span>
                                </p>
                              )}
                            </div>

                            <div className="rounded-2xl bg-orange-50 px-5 py-3 text-right border border-orange-100">
                              <p className="text-sm text-gray-500">Item Total</p>
                              <p className="text-2xl font-bold text-orange-600">
                                ₹{item.price * item.qty + (item.addon?.price || 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
                    <div className="mb-3 flex items-center justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">₹{order.subtotal}</span>
                    </div>

                    <div className="mb-3 flex items-center justify-between text-gray-700">
                      <span>Delivery Charges</span>
                      <span className="font-semibold">₹{order.deliveryCharge}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-orange-200 pt-4">
                      <span className="text-xl font-bold text-gray-800">Total Amount</span>
                      <span className="text-3xl font-extrabold text-orange-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>
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


