import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const [phone,setPhone] = useState("");
  const [error,setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    try{
      await axios.post(`${API_URL}/signup`,{
        name,
        email,
        password,
        confirmPassword:confirmpass,
        phone
      });
      navigate("/otpverify", {
        state : {email}
      });
    }
    catch(error){
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      }
      else{
      alert(error.response?.data?.message || "Signup failed");
    }
  }
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[400px]">
        <h2 className="text-2xl font-bold text-center text-brown-800 mb-6">Cafe Signup ☕</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          onChange={(e) => setEmail(e.target.value)}
        />
        

        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full mb-3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          onChange={(e) => setPhone(e.target.value)}
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password (atleast 5 characters)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            className="absolute right-3 top-2.5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            onChange={(e) => setConfirmpass(e.target.value)}
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <button onClick={handleSubmit} className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700">
          Sign Up
        </button>

        {error && <p className="text-red-500 font-bold mb-2">{error}</p>}

        <p className="text-center mt-4 text-sm">
          Already have an account? 
          <Link to="/login" className="text-amber-600 font-semibold"> Login</Link>
        </p>
      </div>
    </div>
  )
}