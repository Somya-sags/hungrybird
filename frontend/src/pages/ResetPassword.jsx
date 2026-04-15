import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/reset-password/${token}`,
        { password }
      );

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
   <form
  onSubmit={handleSubmit}
  className="max-w-md mx-auto mt-20 bg-white shadow-lg rounded-2xl p-8 flex flex-col gap-5"
>
  <h2 className="text-2xl font-bold text-center text-gray-800">
    Reset Password
  </h2>

  <p className="text-sm text-gray-500 text-center">
    Enter your new password and confirm it below.
  </p>

  <input
    type="password"
    placeholder="New Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  />

  <input
    type="password"
    placeholder="Confirm Password"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
  />

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-200"
  >
    Reset Password
  </button>
</form>
  );
}