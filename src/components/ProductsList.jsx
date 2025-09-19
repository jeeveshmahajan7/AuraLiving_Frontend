import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import useFetch from "../../useFetch";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";
import { TbLoader } from "react-icons/tb";

import ProductsContext from "../contexts/ProductsContext";
import FavoriteButton from "./FavoriteButton";
import useFavorites from "../Hooks/useFavorites";
import useCart from "../Hooks/useCart";

const ProductsList = () => {
  const { data, loading, error } = useFetch(
    "https://aura-living-backend.vercel.app/products"
  );

  const { toggleFavorite } = useFavorites();
  const { addToCart, loadingItems } = useCart();

  const productsArray = Array.isArray(data?.products) ? data.products : [];

  // filtering products basis filters applied
  const [filteredProductsData, setFilteredProductsData] = useState([]);

  const {
    priceUpperLimit,
    selectedCategories,
    minimumRating,
    sortingRule,
    setFilteredProductsLength,
    localFavoriteIds,
    searchQuery,
  } = useContext(ProductsContext);

  // runs on filter change
  useEffect(() => {
    try {
      if (!data?.products) {
        setFilteredProductsData([]);
        setFilteredProductsLength(0);
        return;
      }

      const filteredProducts = productsArray.filter((product) => {
        if (!product) return false;

        const matchesPrice = product.price < priceUpperLimit;
        const matchesRating = product.rating > parseInt(minimumRating);

        // search by title or category
        const matchesSearchQuery = searchQuery
          ? product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.toLowerCase().includes(searchQuery.toLowerCase())
          : true; // if searchQuery is empty, show all products

        let matchesCategory = true;

        if (selectedCategories.length > 0) {
          matchesCategory = selectedCategories.includes(
            product.category.toLowerCase()
          );
        }

        return (
          matchesPrice && matchesRating && matchesCategory && matchesSearchQuery
        );
      });

      setFilteredProductsData(filteredProducts);
      setFilteredProductsLength(filteredProducts.length);
    } catch (err) {
      console.error("ProductsList filtering error:", err);
      setFilteredProductsData([]);
      setFilteredProductsLength(0);
    }
  }, [data, priceUpperLimit, selectedCategories, minimumRating, searchQuery]);

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
              src={product.imgUrl || ""}
              alt={`${product.title || "Product"} image.`}
            />
            <div className="position-absolute top-0 end-0 m-2">
              <FavoriteButton
                isInitiallyFavorite={isFav}
                productId={product._id}
                onToggle={() => toggleFavorite(product._id)}
              />
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-8">
                  <p>{product.category}</p>
                </div>
                <div className="col-lg-4 text-end">
                  <p className="d-flex align-items-center gap-1">
                    {product.rating || 0}
                    <FaStar />
                  </p>
                </div>
              </div>

              <h5>{product.title}</h5>
              <p className="mb-1">₹ {product.price}</p>

              <button
                onClick={(e) => {
                  e.preventDefault(); // prevents <Link> navigation
                  e.stopPropagation(); // prevents bubbling to card
                  addToCart(product._id);
                  toast.success("Product added to Cart");
                }}
                className="btn btn-custom w-50"
                disabled={loadingItems[product._id]} // ⬅️ disable while loading
              >
                {loadingItems[product._id] ? (
                  <TbLoader className="spin" />
                ) : (
                  "ADD TO CART"
                )}
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <>
      {loading && (
        <p className="container loading-custom">Loading Products List...</p>
      )}
      {error && <p className="container">Error loading products.</p>}
      <div className="row">{productsList}</div>
    </>
  );
};

export default ProductsList;
