import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useFetch from "../../useFetch";
import useCart from "../Hooks/useCart";

import Header from "../components/Header";
import ProductsContext from "../contexts/ProductsContext";

const Cart = () => {
  const { userId, localCartItems, setLocalCartItems } =
    useContext(ProductsContext);

  const { data, loading, error } = useFetch(
    `https://aura-living-backend.vercel.app/users/${userId}/cart`
  );

  const { addToCart, removeFromCart } = useCart();

  // local state to store full products data for rendering
  const [cartItemsData, setCartItemsData] = useState([]);

  useEffect(() => {
    if (data?.cart) {
      setLocalCartItems(
        Object.fromEntries(
          data.cart.map((item) => [item.product._id, item.quantity])
        )
      );
      setCartItemsData(data.cart);
    }
  }, [data, setLocalCartItems]);

  if (error) return <p>An error occured.</p>;

  if (loading) {
    return <div>Loading cart...</div>;
  }

  // filter cart items for instant load after cart items change
  const filteredCartItems = cartItemsData.filter(
    (item) => localCartItems[item.product._id] > 0
  );

  if (!loading && filteredCartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const cartListing = filteredCartItems.map((cartItem) => (
    <div key={cartItem.product._id} className="col-md-3 mb-4">
      <Link
        className="text-decoration-none"
        to={`/products/details/${cartItem.product._id}`}
      >
        <div className="card card-products mb-3">
          <img
            className="card-img-top img-fluid card-img object-fit-cover"
            src={`${cartItem.product.imgUrl}`}
            alt={`${cartItem.product.title} image.`}
          />

          <div className="card-body">
            <h6>{cartItem.product.title}</h6>
            <p>₹ {cartItem.product.price}</p>
            <p>Quantity: {cartItem.quantity}</p>
            <div className="pb-2 pt-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(cartItem.product._id);
                }}
                className="btn-custom"
              >
                +
              </button>{" "}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromCart(cartItem.product._id);
                }}
                className="btn-custom"
              >
                -
              </button>
            </div>
            <button htmlFor="" className="btn btn-second-custom w-100">
              Move to Favorites
            </button>
          </div>
        </div>
      </Link>
    </div>
  ));

  return (
    <>
      <Header />
      <main className="container">
        <h1 className="display-6 py-5">My Cart</h1>

        {error && <p>An error occurred.</p>}

        {loading ? (
          <div>Loading Cart...</div>
        ) : filteredCartItems.length === 0 && loading === false ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="row">{cartListing}</div>
        )}
      </main>
    </>
  );
};

export default Cart;
