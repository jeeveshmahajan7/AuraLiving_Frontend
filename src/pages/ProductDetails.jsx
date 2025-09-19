import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { TbLoader } from "react-icons/tb";

import useFetch from "../../useFetch";
import useCart from "../Hooks/useCart";
import useFavorites from "../Hooks/useFavorites";
import ProductsContext from "../contexts/ProductsContext";

import FavoriteButton from "../components/FavoriteButton";

const ProductDetails = () => {
  const { productId } = useParams();
  const { data, loading, error } = useFetch(
    `https://aura-living-backend.vercel.app/products/details/${productId}`
  );

  const { addToCart, loadingItems } = useCart();
  const { toggleFavorite } = useFavorites();
  const { localFavoriteIds } = useContext(ProductsContext);

  const [product, setProduct] = useState(null);
  const [discountedPrice, setDiscountedPrice] = useState(null);

  useEffect(() => {
    if (data && data.product) {
      setProduct(data.product);
      setDiscountedPrice(
        Number.isFinite(data.product.discountPercent)
          ? Math.floor(
              data.product.price -
                (data.product.price * data.product.discountPercent) / 100
            )
          : data.product.price
      );
    }
  }, [data]);

  if (loading) return <p className="container loading-custom">Loading...</p>;
  if (error) return <p>An error occured.</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <>
      <div className="container">
        <hr />
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-between product-details-left order-2 order-md-1">
            <div>
              <h1 className="display-4 mt-3 mt-md-0">{product.title}</h1>
              <p>
                <span className="fw-bold me-3">₹{discountedPrice}</span>
                <span className="text-decoration-line-through text-lighter">
                  ₹{product.price}
                </span>{" "}
                <br />
                <span className="text-secondary">
                  {Number.isFinite(data.product.discountPercent)
                    ? product.discountPercent
                    : "0"}
                  % off
                </span>
              </p>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product._id);
                  toast.success("Product added to Cart");
                }}
                className="btn btn-custom w-100 my-2"
                disabled={loadingItems[product._id]} // ⬅️ disable while loading
              >
                {loadingItems[product._id] ? (
                  <TbLoader className="spin" />
                ) : (
                  "ADD TO CART"
                )}
              </button>
            </div>
            <div>
              <p className="display-6">Description</p>
              <ul>
                {product.description.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-md-6 order-1 order-md-2">
            <div className="card">
              <div className="position-relative">
                <div className="position-absolute top-0 end-0 m-2">
                  <FavoriteButton
                    isInitiallyFavorite={
                      localFavoriteIds.includes(product._id) ? true : false
                    }
                    productId={product._id}
                    onToggle={() => toggleFavorite(product._id)}
                  />
                </div>

                <img
                  className="card-img-top img-fluid card-img object-fit-cover custom-height"
                  src={`${product.imgUrl}`}
                  alt={`${product.title} image.`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
