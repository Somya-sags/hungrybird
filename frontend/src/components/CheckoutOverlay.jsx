import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function CheckoutOverlay({ cart,setCart, onClose, navigate }) {
  const [address, setAddress] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

const deliveryCharge = 20;

const subtotal = cart.reduce((sum, item) => {
  const price = Number(item.price) || 0;
  const qty = Number(item.qty) || 0;
  const addonPrice = Number(item.addon?.price) || 0;

  return sum + (price * qty) + addonPrice;
}, 0);

  const total = subtotal + deliveryCharge;

  

  const handleProceed = async () => {
  if (!address.trim()) {
    alert("Please enter your delivery address");
    return;
  }

  const token = localStorage.getItem("token");

  const orderData = {
    items: cart,
    address,
    subtotal,
    deliveryCharge,
    totalAmount: total
  };

  try {
    await axios.post(
      `${API_URL}/orders`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    localStorage.removeItem("cart");
    setCart([]);

    alert("Important : Call 8895292321 to confirm the order.")
    navigate("/monthly-orders");
  } catch (err) {
    alert("Please Login to place order");
  }
};

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-orange-100">
        <div className="bg-orange-500 px-6 py-5 text-white">
          <h2 className="text-2xl font-bold">Review Your Order</h2>
          <p className="text-orange-100 text-sm mt-1">
            Please confirm your items and enter your delivery address
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Quantity: {item.qty}
                    </p>

                    {item.selectedFlavour && (
                      <p className="text-sm text-gray-500 mt-1">
                        Flavour: {item.selectedFlavour}
                      </p>
                    )}

                    {item.addon && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Add-on:</p>
                        <p className="text-sm text-gray-500 ml-2">
                          • {item.addon.name} (+₹{item.addon.price})
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      ₹
                      {(Number(item.price) * Number(item.qty) ) + Number(item.addon?.price || 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-orange-100 p-5 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delivery Address (Should be within Range of 8 kms)
            </h3>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete address..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-orange-200 px-4 py-3 text-gray-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-5">
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-700 mb-4">
              <span>Delivery Charges</span>
              <span>₹{deliveryCharge}</span>
            </div>

            <div className="border-t border-orange-200 pt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-orange-600">
                ₹{total}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-orange-300 px-6 py-3 font-semibold text-orange-600 hover:bg-orange-50 transition"
            >
              ← Return to Menu
            </button>

            <button
              onClick={handleProceed}
              className="flex-1 rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 transition shadow-lg"
            >
              Place Order →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}