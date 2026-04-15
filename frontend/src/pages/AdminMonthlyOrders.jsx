import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminMonthlyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API_URL}/orders/admin-month-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-8 text-lg font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-extrabold text-slate-900">
              This Month's Orders
            </h1>
            <p className="mt-2 text-lg text-slate-500">
              Latest orders appear first.
            </p>
          </div>

          <div className="rounded-3xl border border-orange-200 bg-white px-7 py-5 shadow-sm">
            <p className="text-lg font-semibold text-slate-500">
              Total Orders This Month
            </p>
            <p className="mt-1 text-5xl font-extrabold text-orange-600">
              {orders.length}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm"
            >
              <div className="grid gap-6 bg-orange-500 px-8 py-6 text-white md:grid-cols-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-orange-100">
                    Order ID
                  </p>
                  <p className="mt-1 break-all text-3xl font-extrabold">
                    #{order._id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-orange-100">Customer</p>
                  <p className="mt-1 text-2xl font-bold">{order.userName}</p>
                </div>

                <div>
                  <p className="text-sm text-orange-100">Contact Number</p>
                  <p className="mt-1 text-2xl font-bold">{order.userPhone}</p>
                </div>

                <div>
                  <p className="text-sm text-orange-100">Placed At</p>
                  <p className="mt-1 text-2xl font-bold">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })} IST
                  </p>
                </div>
              </div>

              <div className="space-y-8 p-8">
                <div className="rounded-3xl border border-orange-100 bg-[#f8f3eb] p-6">
                  <p className="text-lg font-semibold uppercase tracking-wide text-slate-500">
                    Delivery Address
                  </p>
                  <p className="mt-4 text-2xl text-slate-800">{order.address}</p>
                </div>

                <div>
                  <h2 className="mb-5 text-4xl font-extrabold text-slate-900">
                    Ordered Items
                  </h2>

                  <div className="space-y-5">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-5 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-3xl font-bold text-slate-900">
                            {item.name}
                          </p>

                          <p className="mt-3 text-xl text-slate-600">
                            Quantity: {item.qty}
                          </p>

                          {item.selectedFlavour && (
                            <p className="mt-2 text-lg text-slate-500">
                              Flavour: {item.selectedFlavour}
                            </p>
                          )}

                          {item.addon?.name && (
                            <p className="mt-2 text-lg text-slate-500">
                              Add-on: {item.addon.name} (+₹{item.addon.price})
                            </p>
                          )}
                        </div>

                        <div className="rounded-3xl border border-orange-100 bg-[#f8f3eb] px-6 py-5 text-center">
                          <p className="text-lg text-slate-500">Item Total</p>
                          <p className="mt-2 text-4xl font-extrabold text-orange-600">
                            ₹
                            {(item.price * item.qty) + (item.addon?.price || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-orange-100 bg-[#f8f3eb] p-6">
                  <div className="space-y-4 text-2xl text-slate-700">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Delivery Charges</span>
                      <span>₹{order.deliveryCharge}</span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-orange-200 pt-5">
                    <div className="flex items-center justify-between">
                      <p className="text-4xl font-extrabold text-slate-900">
                        Total Amount
                      </p>
                      <p className="text-5xl font-extrabold text-orange-600">
                        ₹{order.totalAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
