import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useFetch from "../../useFetch";

import ProductsContext from "../contexts/ProductsContext";
import FavoriteButton from "./FavoriteButton";
import useFavorites from "../Hooks/useFavorites";
import useCart from "../Hooks/useCart";

const ProductsList = () => {
  const { data, loading, error } = useFetch(
    "https://aura-living-backend.vercel.app/products"
  );

  const { toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  // filtering products basis filters applied
  const [filteredProductsData, setFilteredProductsData] = useState([]);

  const {
    priceUpperLimit,
    selectedCategories,
    minimumRating,
    sortingRule,
    setFilteredProductsLength,
    localFavoriteIds,
  } = useContext(ProductsContext);

  // runs on filter change
  useEffect(() => {
    if (!data?.products) return;

    const filteredProducts = data.products.filter((product) => {
      const matchesPrice = product.price < priceUpperLimit;
      const matchesRating = product.rating > parseInt(minimumRating);
      let matchesCategory = true;

      if (selectedCategories.length > 0) {
        matchesCategory = selectedCategories.includes(
          product.category.toLowerCase()
        );
      }

      return matchesPrice && matchesRating && matchesCategory;
    });

    setFilteredProductsData(filteredProducts);
    setFilteredProductsLength(filteredProducts.length);
  }, [data, priceUpperLimit, selectedCategories, minimumRating]);

  const finalProducts =
    sortingRule === ""
      ? filteredProductsData
      : sortingRule === "lowToHigh"
      ? [...filteredProductsData].sort((a, b) => a.price - b.price)
      : [...filteredProductsData].sort((a, b) => b.price - a.price);

  const productsList = finalProducts?.map((product) => {
    const isFav = localFavoriteIds.includes(product._id);
    return (
      <div key={product._id} className="col-md-4 mb-4">
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
                isInitiallyFavorite={isFav}
                productId={product._id}
                onToggle={() => toggleFavorite(product._id)}
              />
            </div>
            <div className="card-body">
              <p>{product.category}</p>
              <h5>{product.title}</h5>
              <p>₹ {product.price}</p>
              <button
                onClick={(e) => {
                  e.preventDefault(); // prevents <Link> navigation
                  e.stopPropagation(); // prevents bubbling to card
                  addToCart(product._id);
                }}
                className="btn btn-custom"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  });

  return <>{productsList}</>;
};

export default ProductsList;
