import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SharedOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/orders/public/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => alert("Order not found"));
  }, [id]);

  if (!order) return <p className="text-center mt-10">Loading...</p>;

  // ✅ Calculate subtotal dynamically
  const subtotal = order.items.reduce((sum, item) => {
    const addonPrice = item.addon ? item.addon.price : 0;
    return sum + (item.price * item.qty) + addonPrice
  }, 0);

  // ✅ Delivery (you can change logic if dynamic)
  const deliveryCharge = order.totalAmount - subtotal;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <p className="text-gray-500 text-sm">Order ID</p>
          <h2 className="font-semibold text-lg">
            #{order._id.slice(-8)}
          </h2>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-sm">Placed On</p>
          <p className="font-medium">
            {new Date(order.createdAt).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 space-y-4">
        {order.items.map((item, index) => {
          const addonPrice = item.addon ? item.addon.price : 0;
          const itemTotal = (item.price * item.qty) + addonPrice;

          return (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg flex justify-between"
            >
              <div>
                <h3 className="font-semibold">{item.name}</h3>

                <p className="text-sm text-gray-600">
                  Quantity: {item.qty}
                </p>

                {item.addon && (
                  <p className="text-sm text-gray-600">
                    Add-on: {item.addon.name} (+₹{item.addon.price})
                  </p>
                )}

                {item.selectedFlavour && (
                  <p className="text-sm text-gray-600">
                    Flavour: {item.selectedFlavour}
                  </p>
                )}
              </div>

              <div className="font-semibold text-orange-600">
                ₹{itemTotal}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bill Summary */}
      <div className="mt-6 border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between text-gray-700">
          <span>Delivery Charges</span>
          <span>₹{deliveryCharge}</span>
        </div>

        <div className="flex justify-between font-bold text-lg mt-3">
          <span>Total Amount</span>
          <span className="text-orange-600">₹{order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}