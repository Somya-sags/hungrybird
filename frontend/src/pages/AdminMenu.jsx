import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminMenu() {

  // ================= CATEGORY STATE =================
  const [category, setCategory] = useState("");
  const [flavours, setFlavours] = useState([]);
  const [addons, setAddons] = useState([]);
  const [flavourInput, setFlavourInput] = useState("");
  const [addonInput, setAddonInput] = useState({ name: "", price: "" });

  const [categoriesDraft, setCategoriesDraft] = useState([]);
  const [categories, setCategories] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
    const addFlavour = () => {
    if (!flavourInput) return;
    setFlavours([...flavours, flavourInput]);
    setFlavourInput("");
  };

  const addAddon = () => {
    if (!addonInput.name || !addonInput.price) return;
    setAddons([...addons, addonInput]);
    setAddonInput({ name: "", price: "" });
  };

  const handleAddCategory = () => {
  if (!category) return alert("Enter category");

  const newCategory = {
    category,
    flavours,
    addons
  };

  setCategoriesDraft([...categoriesDraft, newCategory]);

  // Reset inputs
  setCategory("");
  setFlavours([]);
  setAddons([]);

  
};


const handleSaveCategory = async () => {
  if (categoriesDraft.length === 0) {
    return alert("No categories to save");
  }

  try {
    const res = await axios.post(
      `${API_URL}/api/categories/bulk`,
      categoriesDraft
    );

    alert("Categories saved!");

    // Move draft → permanent
    setCategories([...categories, ...res.data]);

    // Clear draft
    setCategoriesDraft([]);

  } catch (err) {
    console.error(err);
    alert("Error saving categories");
  }
};

  // ================= ITEM STATE =================
  const [item, setItem] = useState({
    category: "",
    name: "",
    price: "",
    type: "veg"
  });

  const [itemsDraft, setItemsDraft] = useState([]);

  const handleAddItem = () => {
  if (!item.categoryId || !item.name || !item.price) {
    return alert("Fill all fields");
  }

  setItemsDraft([...itemsDraft, item]);

  setItem({
    categoryId: "",
    name: "",
    price: "",
    type: "veg"
  });

  
};

const handleSaveItems = async () => {
  if (itemsDraft.length === 0) {
    return alert("No items to save");
  }

  try {
    await axios.post(
      `${API_URL}/api/items/bulk`,
      itemsDraft
    );
    console.log(itemsDraft);
    alert("Items saved!");

    setItemsDraft([]);

  } catch (err) {
    console.error(err);
    alert("Error saving items");
  }
};

const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

 useEffect(() => {
    fetchCategories();
  }, []);


  return (
    
    <div className="grid md:grid-cols-2 gap-8 p-10">

      {/* ================= CATEGORY BOX ================= */}
      <div className="bg-white p-6 rounded-xl shadow-md h-110">

        <h2 className="text-xl font-bold mb-4">Create Category</h2>

        <input
          type="text"
          placeholder="Category Name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        {/* Flavours */}
        <div className="mb-4">
          <p className="font-medium">Flavours</p>

          <div className="flex gap-2 mt-2">
            <input
              value={flavourInput}
              onChange={(e) => setFlavourInput(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button onClick={addFlavour} className="bg-orange-500 text-white px-4 rounded">
              Add
            </button>
          </div>

          <div className="flex gap-2 mt-2 flex-wrap">
            {flavours.map((f, i) => (
              <span key={i} className="bg-gray-200 px-3 py-1 rounded">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Addons */}
        <div className="mb-4">
          <p className="font-medium">Add-ons</p>

          <div className="flex gap-2 mt-2">
            <input
              placeholder="Name"
              value={addonInput.name}
              onChange={(e) =>
                setAddonInput({ ...addonInput, name: e.target.value })
              }
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Price"
              value={addonInput.price}
              onChange={(e) =>
                setAddonInput({ ...addonInput, price: e.target.value })
              }
              className="border p-2 rounded w-24"
            />
            <button onClick={addAddon} className="bg-orange-500 text-white px-4 rounded">
              Add
            </button>
          </div>

          <div className="mt-2">
            {addons.map((a, i) => (
              <div key={i} className="flex justify-between">
                <span>{a.name}</span>
                <span>₹{a.price}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between w-full mt-10">
        <button
          onClick={handleAddCategory}
          className="bg-orange-500 text-white px-6 py-2 rounded-full"
        >
          Add Category
        </button>

        <button
          onClick={handleSaveCategory}
          className="bg-green-500 text-white px-6 py-2 rounded-full"
        >
          Save Category
        </button>
        </div>
      </div>

      {/* ================= ITEM BOX ================= */}
      <div className="bg-white p-6 rounded-xl shadow-md h-110">

        <h2 className="text-xl font-bold mb-6">Add Item</h2>

        <div className="grid gap-4">

          {/* Category Dropdown */}
          <select
            value={item.categoryId}
            onChange={(e) =>
              setItem({ ...item, categoryId: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
             {categories.map((cat, i) => (
                <option key={cat._id} value={cat._id}>
                    {cat.category}
                </option>
             ))}
          </select>

          <input
            placeholder="Item Name"
            value={item.name}
            onChange={(e) =>
              setItem({ ...item, name: e.target.value })
            }
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) =>
              setItem({ ...item, price: e.target.value })
            }
            className="border p-2 rounded"
          />

          <select
            value={item.type}
            onChange={(e) =>
              setItem({ ...item, type: e.target.value })
            }
            className="border p-2 rounded lowercase"
          >
            <option value="veg">veg</option>
            <option value="nonveg">non-Veg</option>
            <option value="drink">drink</option>
          </select>

        </div>

        <button
          onClick={handleAddItem}
          className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-full w-full"
        >
          Add Item
        </button>

        <button
          onClick={handleSaveItems}
          className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full w-full"
        >
          Save Item
        </button>
      </div>

    </div>
  );
}