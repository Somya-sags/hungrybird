import { useEffect, useState, useRef } from "react";
import axios from "axios";
import CheckoutOverlay from "../components/CheckoutOverlay";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedFlavours, setSelectedFlavours] = useState({});

  const sectionRefs = useRef({});
  const navigate = useNavigate();

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchMenu();

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    const handleScroll = () => {
    let closest = null;
    let minDistance = Infinity;

    Object.entries(sectionRefs.current).forEach(([id, el]) => {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const distance = Math.abs(rect.top - 100);  

      if (rect.top <= 150 && distance < minDistance) {
        minDistance = distance;
        closest = id;
      }
    });

    if (closest) {
      setActiveCategory(closest);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
  }, []);



 const handleAddonChange = (categoryId, addon) => {
  setSelectedAddons((prev) => {
    const current = prev[categoryId];

    
    if (current && current.name === addon.name) {
      const updated = { ...prev };
      delete updated[categoryId];
      return updated;
    }

    return {
      ...prev,
      [categoryId]: addon,
    };
  });
};


  const fetchMenu = async () => {
    const res = await axios.get("http://localhost:5000/api/menu");
    setCategories(res.data.categories);
    setItems(res.data.items);
  };
  // =================SAVE CART=================
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // =================SCROLL=================
  const scrollToCategory = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
  };

  // ================= FILTER =================
  const getItemsByCategory = (categoryId) => {
    return items.filter((item) => String(item.categoryId) === String(categoryId));
  };

  // ================= CART LOGIC =================
  const getQty = (itemId) => {
    const found = cart.find((i) => i._id === itemId);
    return found ? found.qty : 0;
  };

  const increaseQty = (item) => {
  const addon = selectedAddons[item.categoryId];
   const flavour = selectedFlavours[item.categoryId];

  const exists = cart.find((i) => i._id === item._id);

  if (exists) {
    setCart(
      cart.map((i) =>
        i._id === item._id ? { ...i, qty: i.qty + 1 } : i
      )
    );
  } else {
    setCart([
      ...cart,
      {
        ...item,
        qty: 1,
        addon: addon || null,
        selectedFlavour: flavour || null,
      },
    ]);
  }
};

  const decreaseQty = (item) => {
    const exists = cart.find((i) => i._id === item._id);

    if (!exists) return;

    if (exists.qty === 1) {
      setCart(cart.filter((i) => i._id !== item._id));
    } else {
      setCart(
        cart.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty - 1 } : i
        )
      );
    }
  };


  const hasItemInCategory = (categoryId) => {
  return cart.some((item) => String(item.categoryId) === String(categoryId));
};

  // ================= TOTAL =================
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);


  const totalPrice = cart.reduce((sum, i) => {
      const addonPrice = i.addon ? Number(i.addon.price) : 0;
      return sum + i.qty * i.price + addonPrice;
  }, 0);

  const handleCheckout = () => {
    if(totalPrice < 200){
      alert("Minumum Order is Rs.200");
      return;
    }

    setShowCheckout(true);
  }


  function ItemCard({ item, qty, increaseQty, decreaseQty }) {
  return (
    <div className="border rounded-lg p-3 font-[Open Sans] flex justify-between items-center mb-2">

      <div className="flex items-center gap-2">
        
        {/* DOT */}
        <div
  className={`w-4 h-4 border flex items-center justify-center ${
    item.type === "veg" ? "border-green-600" : "border-red-600"
  }`}
>
  <div
    className={`w-2 h-2 rounded-full ${
      item.type === "veg" ? "bg-green-600" : "bg-red-600"
    }`}
  ></div>
</div>

        {/* TEXT */}
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-gray-500">₹{item.price}</p>
        </div>

      </div>

      {qty === 0 ? (
        <button
          onClick={() => increaseQty(item)}
          className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm"
        >
          ADD
        </button>
      ) : (
        <div className="flex items-center gap-2 border rounded-full px-2 py-1">
          <button onClick={() => decreaseQty(item)}>-</button>
          <span>{qty}</span>
          <button onClick={() => increaseQty(item)}>+</button>
        </div>
      )}
    </div>
  );
}

useEffect(() => {
  setCart((prevCart) =>
    prevCart.map((item) => {
      const updatedAddon = selectedAddons[item.categoryId] || null;

      return {
        ...item,
        addon: updatedAddon,
      };
    })
  );
}, [selectedAddons]);

useEffect(() => {
  setCart((prevCart) =>
    prevCart.map((item) => ({
      ...item,
      selectedFlavour: selectedFlavours[item.categoryId] || null,
    }))
  );
}, [selectedFlavours]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-center  items-center my-4">
        <h1 className="font-[Poppins] text-6xl font-semibold">Our Menu</h1>
      </div>

      {/* ================= CATEGORY TABS ================= */}
      <div className="flex gap-3 overflow-x-auto mb-6 sticky top-0 bg-white z-50 py-2">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => {
              setActiveCategory(cat._id); // ✅ force highlight immediately
              scrollToCategory(cat._id);
            }}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition
              ${activeCategory === cat._id 
                ? "bg-black text-white" 
                : "text-black bg-gray-200"}
            `}
          >
            {cat.category}
          </button>
        ))}
      </div>

      {/* ================= CATEGORY SECTIONS ================= */}
      {categories.map((cat) => {
        const catItems = getItemsByCategory(cat._id);

        const veg = catItems.filter((i) => i.type === "veg");
        const nonveg = catItems.filter((i) => i.type === "nonveg");

        const hasVeg = veg.length > 0;
        const hasNonVeg = nonveg.length > 0;

        return (
          
          <div
            id={cat._id}
            key={cat._id}
            ref={(el) => (sectionRefs.current[cat._id] = el)}
            className="mb-10 scroll-mt-24"
          >
            <h2 className="text-xl font-bold font-[Poppins] mb-3">{cat.category}</h2>

            <div
              className={`grid gap-3 ${
                hasVeg && hasNonVeg ? "md:grid-cols-2" : "md:grid-cols-1"
              }`}
            >

              {/* VEG */}
              {hasVeg && (
                <div>
                  {veg.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      qty={getQty(item._id)}
                      increaseQty={increaseQty}
                      decreaseQty={decreaseQty}
                    />
                  ))}
                </div>
              )}

              {/* NON VEG */}
              {hasNonVeg && (
                <div>
                  {nonveg.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      qty={getQty(item._id)}
                      increaseQty={increaseQty}
                      decreaseQty={decreaseQty}
                    />
                  ))}
                </div>
              )}

            </div>

            {/* FLAVOURS */}
            
            {cat.flavours.length > 0 && (
              <>
              <h2 className="text-md mb-3">Flavours</h2>
              <select
                className={`border p-2 rounded mb-3 w-full md:w-64 ${
                  !hasItemInCategory(cat._id) ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!hasItemInCategory(cat._id)}
                value={selectedFlavours[cat._id] || ""}
                onChange={(e) =>
                  setSelectedFlavours((prev) => ({
                    ...prev,
                    [cat._id]: e.target.value,
                  }))
                }
              >
                <option>Select Flavour</option>
                {cat.flavours.map((f, i) => (
                  <option key={i}>{f}</option>
                ))}
              </select>
              </>
            )}

            {/* ADDONS */}
           
            {cat.addons.length > 0 && (
              <>
              <h2 className="text-md mb-3">Add Ons</h2>
              <div className="flex gap-3 flex-wrap mb-4">
                {cat.addons.map((a, i) => (
                  <label
                    key={i}
                    className={`text-sm ${
                      !hasItemInCategory(cat._id) ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`addon-${cat._id}`}
                      className="mr-1"
                      disabled={!hasItemInCategory(cat._id)}
                      checked={selectedAddons[cat._id]?.name === a.name}
                      onClick={() => handleAddonChange(cat._id, a)}
                    />
                    {a.name} (+₹{a.price})
                  </label>
                ))}
              </div>
              </>
            )}

            {/* ITEMS */}
            
          </div>
        );
      })}

      {/* ================= CHECKOUT BAR ================= */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 left-0 w-full bg-orange-600 text-white p-4 flex justify-between items-center">

          <div>
            {totalItems} items | ₹{totalPrice}
          </div>

          <button onClick={handleCheckout} className="bg-white text-orange-600 px-6 py-2 rounded-full">
            Checkout →
          </button>

        </div>
      )}
      {showCheckout && (
        <CheckoutOverlay
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCheckout(false)}
          navigate={navigate}
        />
      )}
    </div>
  );

}