import { useContext, useEffect } from "react";
import ProductsContext from "../contexts/ProductsContext";
import useFetch from "../../useFetch";

const useFavorites = () => {
  const { userId, localFavoriteIds, setLocalFavoriteIds } =
    useContext(ProductsContext);

  // fetch initial favorites from the backend
  const { data: favoritesData } = useFetch(
    `https://aura-living-backend.vercel.app/users/${userId}/favorites`
  );

  useEffect(() => {
    if (favoritesData?.favoriteProducts) {
      setLocalFavoriteIds(
        favoritesData.favoriteProducts.map((prod) => prod._id)
      );
    }
  }, [favoritesData, setLocalFavoriteIds]);

  const toggleFavorite = (productId) => {
    const isFav = localFavoriteIds.includes(productId);
    const method = isFav ? "DELETE" : "POST";

    // update local state instantly, for instant UI changes
    setLocalFavoriteIds((prevData) =>
      isFav
        ? prevData.filter((id) => id !== productId)
        : [...prevData, productId]
    );

    // update backend
    fetch(
      `https://aura-living-backend.vercel.app/users/${userId}/favorites/${productId}`,
      {
        method,
        headers: { "Content-Type": "application/json" },
      }
    ).catch((error) => console.log(error));
  };

  return {
    localFavoriteIds,
    toggleFavorite,
  };
};

export default useFavorites;
