import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useFetch from "../../useFetch";
import useCart from "../Hooks/useCart";

import ProductsContext from "../contexts/ProductsContext";

const Cart = () => {
  const { userId, localCartItems, setLocalCartItems } =
    useContext(ProductsContext);

  const { data, loading, error } = useFetch(
    `https://aura-living-backend.vercel.app/users/${userId}/cart`
  );

  const { addToCart, removeFromCart } = useCart();

  const [hydrated, setHydrated] = useState(false); // tracks if the cart items is populated from the backend

  useEffect(() => {
    if (data?.cart) {
      setLocalCartItems(
        Object.fromEntries(
          data.cart.map((item) => [item.product._id, item.quantity])
        )
      );
      setHydrated(true); // we have backend data now
    }
  }, [data, setLocalCartItems]);

  if (error) return <p>An error occured.</p>;

  if (loading && !hydrated) {
    return <div>Loading cart...</div>;
  }

  const filteredCartItems =
    data?.cart?.filter((item) => localCartItems[item.product._id] > 0) || [];

  if (hydrated && filteredCartItems.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const totalCartPrice = filteredCartItems.reduce(
    (acc, curr) =>
      Math.round(acc + curr.product.price * localCartItems[curr.product._id]),
    0
  );

  const totalCartDiscount = filteredCartItems.reduce(
    (acc, curr) =>
      Math.round(
        acc + curr.product.discountPercent * localCartItems[curr.product._id]
      ),
    0
  );

  const cartAmountAfterDiscount = totalCartPrice - totalCartDiscount;

  const deliveryCarges = cartAmountAfterDiscount > 499 ? 0 : 199;

  const finalOrderAmount = cartAmountAfterDiscount + deliveryCarges;

  const cartListing = filteredCartItems.map((cartItem) => {
    const currentQty = localCartItems[cartItem.product._id] || 0;
    return (
      <div key={cartItem.product._id} className="mb-4">
        <Link
          className="text-decoration-none"
          to={`/products/details/${cartItem.product._id}`}
        >
          <div className="card card-products">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  className="img-fluid rounded-start card-img object-fit-cover"
                  src={`${cartItem.product.imgUrl}`}
                  alt={`${cartItem.product.title} image.`}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h6>{cartItem.product.title}</h6>
                  <p>₹ {cartItem.product.price}</p>
                  <div className="pb-2 pt-0">
                    <span>Quantity:</span>{" "}
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
                    {currentQty}{" "}
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
            </div>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <>
      <main className="container">
        <h1 className="display-6 py-5">My Cart</h1>

        {error && <p>An error occurred.</p>}

        <div className="row">
          <div className="col-md-6">
            <div className="row">{cartListing}</div>
          </div>
          <div className="col-md-6">
            <div className="card px-3 py-4 shadow-sm">
              <h4>CART SUMMARY</h4>
              <hr />
              <p>Items: {filteredCartItems.length}</p>
              <p>Price: ₹{totalCartPrice}</p>
              <p>
                Discount: {totalCartDiscount > 0 ? "-" : ""}₹{totalCartDiscount}
              </p>
              <p>Delivery Charges: ₹{deliveryCarges}</p>
              <hr className="mt-0" />
              <p className="fw-bold">FINAL AMOUNT: ₹{finalOrderAmount}</p>
              <hr className="mt-0" />
              <p>You will save ₹{totalCartDiscount} on this order</p>
              <button className="btn btn-custom w-100">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Cart;
