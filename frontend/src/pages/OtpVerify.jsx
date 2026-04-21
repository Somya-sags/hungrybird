import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

export default function OtpVerify() {
  
  const {state} = useLocation();
  const email = state?.email;
  

  if (!state?.email) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg mb-4">
            <span className="text-3xl">📩</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            OTP Verification
          </h1>

          <p className="text-gray-600 text-sm leading-relaxed">
            We will send a 6-digit OTP to
          </p>

          <p className="text-orange-600 font-semibold text-base mt-1 break-all">
            {email}
          </p>
        </div>

        <OtpContent />
      </div>
    </div>
  );
}

function OtpContent() {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const {state} = useLocation();
  const email = state?.email;
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSendOtp = async () => {
    try{
        console.log(email);
        await axios.post(`${API_URL}/api/auth/sendotp`,{
            email
        });
        setOtpSent(true);
    }
    catch (error) {
  console.log(error); // VERY IMPORTANT
  alert(error.response?.data?.message || error.message);
}
  };

  const handleVerify = async () => {
    try{
      await axios.post(`${API_URL}/api/auth/verifyotp`,{
        email,
        otp
      });
     alert("OTP verified successfully");
     navigate("/login");
    }
    catch(error){
        alert(error.response?.data?.message || "Failed to verify OTP");
    }
  };

  return (
    <div>
      {!otpSent ? (
        <button
          onClick={handleSendOtp}
          className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl"
        >
          Send OTP
        </button>
      ) : (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-Digit OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              placeholder="123456"
              maxLength={6}
              className="w-full border border-orange-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none rounded-2xl px-4 py-3 text-center tracking-[0.5em] text-xl font-semibold text-gray-800"
            />
          </div>

          <button
            onClick={handleVerify}
            className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 text-white font-semibold py-3 rounded-2xl shadow-lg hover:shadow-xl"
          >
            Verify OTP
          </button>

          <button
            onClick={() => setOtpSent(false)}
            className="w-full text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            ← Back to Send OTP
          </button>
        </div>
      )}
    </div>
  );
}
