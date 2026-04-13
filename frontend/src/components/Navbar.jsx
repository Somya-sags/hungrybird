import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [home, setHome] = useState(true);

  if (loading) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-orange-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white shadow-md transition-transform duration-200 group-hover:scale-105">
            H
          </div>

          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 transition-colors duration-200 group-hover:text-orange-600">
              Hungry Bird
            </h1>
            <p className="text-xs font-medium text-gray-400">
              Fresh food, delivered fast
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-5">
          {!user ? (
            <>
              <Link
                to="/login"
                className="rounded-xl border border-orange-200 px-5 py-2 font-semibold text-orange-600 transition-all duration-200 hover:border-orange-500 hover:bg-orange-50 hover:shadow-sm"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2 font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              {localStorage.getItem("isAdmin") !== "true" && (
                  <div onClick={() => setHome(!home)}>
                    {home ? (
                      <Link
                        to="/monthly-orders"
                        className="flex items-center rounded-xl bg-orange-500 px-5 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-md"
                      >
                        Your Orders
                      </Link>
                    ) : (
                      <Link
                        to="/"
                        className="flex items-center rounded-xl border border-orange-200 px-5 py-2.5 font-semibold text-orange-600 transition-all duration-200 hover:border-orange-500 hover:bg-orange-50"
                      >
                        Return to Home
                      </Link>
                    )}
                  </div>
                )}

              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-sm font-bold uppercase text-white shadow-sm">
                  {user.name?.charAt(0)}
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Welcome
                  </p>
                  <p className="max-w-[140px] truncate text-sm font-bold text-gray-800">
                    {user.name}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-md"
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
