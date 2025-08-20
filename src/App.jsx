import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import Home from "./pages/Home";
import ProductsListing from "./pages/productsListing";
import ProductDetails from "./pages/ProductDetails";
import ProductsContext from "./contexts/ProductsContext";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";

function App() {
  const [priceUpperLimit, setPriceUpperLimit] = useState(10000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minimumRating, setMinimumRating] = useState(0);
  const [filteredProductsLength, setFilteredProductsLength] = useState(0);
  const [sortingRule, setSortingRule] = useState("");
  const [localFavoriteIds, setLocalFavoriteIds] = useState([]); // to store favorite products locally for instant UI changes
  const [localCartItems, setLocalCartItems] = useState({}); // to store cart items locally for instant UI changes
  const userId = "6891b0f229130a83422d47db";
  const API = "https://aura-living-backend.vercel.app";

  return (
    <ProductsContext.Provider
      value={{
        API,
        userId,
        setPriceUpperLimit,
        setSelectedCategories,
        setMinimumRating,
        setFilteredProductsLength,
        setSortingRule,
        setLocalFavoriteIds,
        setLocalCartItems,
        priceUpperLimit,
        selectedCategories,
        minimumRating,
        filteredProductsLength,
        sortingRule,
        localFavoriteIds,
        localCartItems,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsListing />} />
          <Route path="/products/:category" element={<ProductsListing />} />
          <Route
            path="/products/details/:productId"
            element={<ProductDetails />}
          />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </ProductsContext.Provider>
  );
}

export default App;
