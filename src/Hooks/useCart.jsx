import { useContext, useEffect, useState } from "react";

import ProductsContext from "../contexts/ProductsContext";
import useFetch from "../../useFetch";

const useCart = () => {
  const { localCartItems, setLocalCartItems, userId, API } =
    useContext(ProductsContext);

  // track loading state for every product Id
  const [loadingItems, setLoadingItems] = useState({});

  // fetching initial cart data from backend
  const { data: cartData } = useFetch(
    `https://aura-living-backend.vercel.app/users/${userId}/cart`
  );

  // load cart from localstorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setLocalCartItems(JSON.parse(savedCart));
    }
  }, [setLocalCartItems]);

  // whenever cart data comes from backend, update state + localStorage
  useEffect(() => {
    if (cartData?.cart) {
      const mapped = {};
      cartData.cart.forEach((item) => {
        mapped[item.product._id] = item.quantity;
      });

      setLocalCartItems(mapped);

      // save in localStorage
      localStorage.setItem("cart", JSON.stringify(mapped));
    }
  }, [cartData, setLocalCartItems]);

  // whenever localCartItems change, sync to localStorage
  useEffect(() => {
    if (localCartItems) {
      localStorage.setItem("cart", JSON.stringify(localCartItems));
    }
  }, [localCartItems]);

  // adds a product or increases the qty (as set in backend)
  const addToCart = async (productId) => {
    setLoadingItems((prev) => ({ ...prev, [productId]: true }));

    // updating the UI instantly
    setLocalCartItems((prev) => {
      const updated = {
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      };

      localStorage.setItem("cart", JSON.stringify(updated)); // save to storage
      return updated;
    });

    try {
      const res = await fetch(`${API}/users/${userId}/cart/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to add to cart.");
      }

      return await res.json();
    } catch (error) {
      console.log("Error adding to cart:", error.message);

      // rollback to prev qty in case of error
      setLocalCartItems((prev) => {
        const qty = (prev[productId] || 0) - 1;
        const copy = { ...prev };

        if (qty <= 0) {
          delete copy[productId];
        } else {
          copy[productId] = qty;
        }

        localStorage.setItem("cart", JSON.stringify(copy)); //rollback save
        return copy;
      });

      throw error;
    } finally {
      setLoadingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // deletes a product
  const removeFromCart = async (productId, removeAll = false) => {
    setLoadingItems((prev) => ({ ...prev, [productId]: true }));

    // updating the UI instantly
    setLocalCartItems((prev) => {
      let updated; 
      if (removeAll || (prev[productId] ?? 0) <= 1) {
        updated = { ...prev };
        delete updated[productId];
      } else {
        updated = { ...prev, [productId]: prev[productId] - 1 };
      }

      localStorage.setItem("cart", JSON.stringify(updated)); // save to storage
      return updated;
    });

    try {
      const res = await fetch(
        `${API}/users/${userId}/cart/${productId}${
          removeAll ? "?all=true" : ""
        }`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove from cart.");
      }

      return await res.json();
    } catch (error) {
      console.log("Error deleting product from cart:", error.message);

      // rollback (re-add one)
      setLocalCartItems((prev) => {
        const updated = {
          ...prev,
          [productId]: (prev[productId] || 0) + 1,
        };

        localStorage.setItem("cart", JSON.stringify(updated)); // rollback save
        return updated;
      });

      throw error;
    } finally {
      setLoadingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return {
    localCartItems,
    addToCart,
    removeFromCart,
    loadingItems,
  };
};

export default useCart;
