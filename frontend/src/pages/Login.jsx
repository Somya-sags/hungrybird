import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const { fetchMe } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post(`${API_URL}/login`,{
        email,password
      })

      const decoded = jwtDecode(res.data.token);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", decoded.isAdmin);
      await fetchMe();

      if (decoded.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
    catch(error){
      if(error.response?.status === 403 && error.response.data.message === "Email Not Verified"){
            alert("Please Verify your email");

            navigate("/otpverify", {
              state: {email}
            });
          }
          else{
            alert(error.response?.data?.message || "Login Failed");
          }
    }
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-[350px]">
        <h2 className="text-2xl font-bold text-center text-brown-800 mb-6">Cafe Login ☕</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <span
            className="absolute right-3 top-2.5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <button onClick={handleSubmit} className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700">
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account? 
          <Link to="/signup" className="text-amber-600 font-semibold"> Sign Up</Link><br></br>
          <Link to="/forgot-password" className="text-blue-500 text-sm ml-2">
          Forgot Password?
        </Link>
        </p>
        
      </div>
    </div>
  );
}