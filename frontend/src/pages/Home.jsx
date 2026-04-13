import React from "react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import bgimage from "../assets/images/cafebg.png"
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="font-sans">

      {/* Hero Section */}
      <section
        className="relative h-[80vh] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            `url(${bgimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-6xl font-bold mb-4">
            Hungry Bird Kitchen
          </h1>

          <p className="text-sm md:text-lg mb-6 max-w-xl mx-auto">
            Authentic Indian flavours crafted with love. From our kitchen to your table.
          </p>
        
          <Link to="/menu">
          <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 mb-4 rounded-full text-white">
            Explore Our Menu
          </button>
          </Link>

          <p className="text-sm md:text-lg mb-6 max-w-xl mx-auto">
            Phone : +91-8895292321<br></br>
            Call for Event Bookings (Birthdays,Anniversary, etc..)
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 bg-gray-50">
        <div className="grid gap-8 md:grid-cols-3">

          <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="text-3xl mb-4">🍛</div>
            <h3 className="text-lg font-semibold mb-2">Authentic Recipes</h3>
            <p className="text-gray-600 text-sm">
              Traditional recipes passed down through generations
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="text-3xl mb-4">🌿</div>
            <h3 className="text-lg font-semibold mb-2">Fresh Ingredients</h3>
            <p className="text-gray-600 text-sm">
              Locally sourced, farm-fresh ingredients every day
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm text-center hover:shadow-md transition">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Quick Service</h3>
            <p className="text-gray-600 text-sm">
              Order online and enjoy a seamless dining experience
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t">
        <div className="flex justify-center gap-8 text-2xl">
          
          <a href="https://www.instagram.com/hungrybird_gunupur?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
             target="_blank"
          className="text-gray-600 hover:text-pink-500">
            <FaInstagram />
          </a>

          <a href="https://whatsapp.com/channel/0029VbCQhoR0bIduDEAiiu3X" className="text-gray-600 hover:text-green-500" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
          </a>

        </div>
      </footer>

    </div>
  );
}