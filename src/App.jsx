import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

import Home from "./pages/Home";
import ProductsListing from "./pages/productsListing";
import ProductDetails from "./pages/ProductDetails";
import ProductsContext from "./contexts/ProductsContext";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import CheckoutPage from "./pages/CheckoutPage";
import Orders from "./pages/Orders";
import SelectAddress from "./pages/SelectAddress";
import AccountLayout from "./pages/AccountLayout";
import Profile from "./components/Profile";

function App() {
  const [priceUpperLimit, setPriceUpperLimit] = useState(10000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minimumRating, setMinimumRating] = useState(0);
  const [filteredProductsLength, setFilteredProductsLength] = useState(0);
  const [sortingRule, setSortingRule] = useState("");
  const [localFavoriteIds, setLocalFavoriteIds] = useState([]); // to store favorite products locally for instant UI changes
  const [localCartItems, setLocalCartItems] = useState({}); // to store cart items locally for instant UI changes
  const [cartDetails, setCartDetails] = useState({}); // final cart details for placing order
  const [searchQuery, setSearchQuery] = useState("");
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
        setCartDetails,
        setSearchQuery,
        searchQuery,
        priceUpperLimit,
        selectedCategories,
        minimumRating,
        filteredProductsLength,
        sortingRule,
        localFavoriteIds,
        localCartItems,
        cartDetails,
      }}
    >
      <Router>
        <Header />
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
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/address" element={<SelectAddress />} />
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            {/* Default active tab */}
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="address/new" element={<SelectAddress />} />
          </Route>
        </Routes>
      </Router>
      {/* Added ToastContainer once at root of App */}
      <ToastContainer position="top-center" autoClose={2000} />
    </ProductsContext.Provider>
  );
}

export default App;
