import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { TbLoader } from "react-icons/tb";

import ProductsContext from "../contexts/ProductsContext";
import useFavorites from "../Hooks/useFavorites";
import useFetch from "../../useFetch";
import useCart from "../Hooks/useCart";

import FavoriteButton from "../components/FavoriteButton";

const Favorites = () => {
  const { userId, localFavoriteIds, setLocalFavoriteIds } =
    useContext(ProductsContext);
  const { toggleFavorite } = useFavorites();

  const { data, error } = useFetch(
    `https://aura-living-backend.vercel.app/users/${userId}/favorites`
  );

  const { addToCart, loadingItems } = useCart();

  // Local state to store full favorite products data
  const [favoriteProductsData, setFavoriteProductsData] = useState(null);

  // Ensure localFavoriteIds is synced with backend data
  useEffect(() => {
    if (data?.favoriteProducts) {
      setLocalFavoriteIds(data.favoriteProducts.map((prod) => prod._id));
      setFavoriteProductsData(data.favoriteProducts);
    }
  }, [data, setLocalFavoriteIds]);

  // While favoriteProductsData is null, data not yet loaded
  if (favoriteProductsData === null) {
    return <p className="container loading-custom">Loading favorites...</p>;
  }

  // If fetch hook reports error
  if (error) {
    return <p>An error occurred.</p>;
  }

  // Filter UI list instantly when favorites change
  const filteredFavorites = favoriteProductsData.filter((product) =>
    localFavoriteIds.includes(product._id)
  );

  // Show empty message only if data loaded but no favorites
  if (filteredFavorites.length === 0) {
    return <p>Your favorites list is empty.</p>;
  }

  const favoritesListing = filteredFavorites.map((product) => (
    <div key={product._id} className="col-md-3 mb-4">
      <Link
        className="text-decoration-none"
        to={`/products/details/${product._id}`}
      >
        <div className="card card-products mb-3 position-relative">
          <img
            className="card-img-top img-fluid card-img object-fit-cover"
            src={`${product.imgUrl}`}
            alt={`${product.title} image.`}
          />

          <div className="position-absolute top-0 end-0 m-2">
            <FavoriteButton
              isInitiallyFavorite={true} // since the api above is only fetching favorite products
              productId={product._id}
              onToggle={() => toggleFavorite(product._id)}
            />
          </div>

          <div className="card-body">
            <h6>{product.title}</h6>
            <p>₹ {product.price}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product._id);
              }}
              className="btn btn-custom w-50"
              disabled={loadingItems[product._id]}
            >
              {loadingItems[product._id] ? (
                <TbLoader className="spin" />
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  ));

  return (
    <>
      <main className="container">
        <h1 className="display-6 py-5">My Wishlist</h1>
        <div className="row">{favoritesListing}</div>
      </main>
    </>
  );
};

export default Favorites;
