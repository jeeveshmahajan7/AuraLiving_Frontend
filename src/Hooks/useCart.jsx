import { useContext, useEffect } from "react";

import ProductsContext from "../contexts/ProductsContext";
import useFetch from "../../useFetch";

const useCart = () => {
  const { localCartItems, setLocalCartItems, userId, API } =
    useContext(ProductsContext);

  // fetching initial cart data from backend
  const { data: cartData } = useFetch(
    `https://aura-living-backend.vercel.app/users/${userId}/cart`
  );

  useEffect(() => {
    if (cartData?.cart) {
      const mapped = {};
      cartData.cart.forEach((item) => {
        mapped[item.product._id] = item.quantity;
      });

      setLocalCartItems(mapped);
    }
  }, [cartData, setLocalCartItems]);

  // adds a product or increases the qty (as set in backend)
  const addToCart = async (productId) => {
    // updating the UI instantly
    setLocalCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));

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

        if (qty <= 0) {
          const copy = [...prev];
          delete copy[productId];
          return copy;
        }
        return { ...prev, [productId]: qty };
      });

      throw error;
    }
  };

  // deletes a product
  const removeFromCart = async (productId, removeAll = false) => {
    // updating the UI instantly
    setLocalCartItems((prev) => {
      if (removeAll || (prev[productId] ?? 0) <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: prev[productId] - 1 };
    });

    try {
      const res = await fetch(
        `${API}/users/${userId}/cart/${productId}/${removeAll}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove from cart.");
      }

      return await res.json();
    } catch (error) {
      console.log("Error deleting product from cart:", error.message);

      // rollback (re-add one)
      setLocalCartItems((prev) => ({
        ...prev,
        [productId]: (prev[productId] || 0) + 1,
      }));

      throw error;
    }
  };

  return {
    localCartItems,
    addToCart,
    removeFromCart,
  };
};

export default useCart;
