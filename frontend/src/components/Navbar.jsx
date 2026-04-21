import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [home, setHome] = useState(true);

  if (loading) return <div>Loading ....</div>;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-md shadow-sm">
  <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-10">
    
    {/* Logo */}
    <Link to="/" className="flex items-center gap-2 sm:gap-3">
      <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-orange-500 text-sm sm:text-lg font-bold text-white">
        H
      </div>

      <div>
        <h1 className="text-lg sm:text-2xl font-extrabold text-gray-900">
          Hungry Bird
        </h1>
        <p className="hidden sm:block text-xs text-gray-400">
          Fresh food, delivered fast
        </p>
      </div>
    </Link>

    {/* Right Section */}
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
      
      {!user ? (
        <>
          <Link
            to="/login"
            className="px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base border border-orange-200 rounded-lg text-orange-600"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-3 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base bg-orange-500 text-white rounded-lg"
          >
            Signup
          </Link>
        </>
      ) : (
        <>
          {localStorage.getItem("isAdmin") !== "true" && (
            <Link
              to={home ? "/monthly-orders" : "/"}
              onClick={() => setHome(!home)}
              className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm bg-orange-500 text-white rounded-lg whitespace-nowrap"
            >
              {home ? "Orders" : "Home"}
            </Link>
          )}

          {/* Profile */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-xl bg-gray-50">
            <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-white text-xs font-bold">
              {user.name?.charAt(0)}
            </div>

            <p className="hidden md:block text-sm font-semibold truncate max-w-[100px]">
              {user.name}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm bg-red-500 text-white rounded-lg whitespace-nowrap"
          >
            Logout
          </button>
        </>
      )}
    </div>
  </div>
</nav>
  );
}
