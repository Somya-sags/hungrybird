import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      alert(res.data.message);
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-5"
>
  <h2 className="text-2xl font-bold text-center text-gray-800">
    Forgot Password
  </h2>

  <p className="text-sm text-gray-500 text-center">
    Enter your email address and we will send you a password reset link.
  </p>

  <input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  />

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200"
  >
    Send Reset Link
  </button>
</form>
  );
}