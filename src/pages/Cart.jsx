import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useFetch from "../../useFetch";
import useCart from "../Hooks/useCart";

import ProductsContext from "../contexts/ProductsContext";

const Cart = () => {
  const {
    userId,
    localCartItems,
    setLocalCartItems,
    cartDetails,
    setCartDetails,
  } = useContext(ProductsContext);

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
  }, [data]);

  const filteredCartItems = data?.cart
    ? data.cart.filter((item) => localCartItems[item.product._id] > 0)
    : [];

  useEffect(() => {
    if (!filteredCartItems.length) {
      if (cartDetails !== null) {
        // only update if not already null
        setCartDetails(null);
      }
      return;
    }

    const totalCartPrice = filteredCartItems.reduce(
      (acc, curr) =>
        Math.round(
          acc + curr.product.price * localCartItems[curr.product._id] || 0
        ),
      0
    );

    const totalCartDiscount = filteredCartItems.reduce(
      (acc, curr) =>
        Math.round(
          acc +
            curr.product.discountPercent * localCartItems[curr.product._id] || 0
        ),
      0
    );

    const cartAmountAfterDiscount = totalCartPrice - totalCartDiscount;
    const deliveryCarges = cartAmountAfterDiscount > 499 ? 0 : 199;
    const finalOrderAmount = cartAmountAfterDiscount + deliveryCarges;

    const newDetails = {
      cartItems: filteredCartItems,
      totalCartPrice,
      totalCartDiscount,
      cartAmountAfterDiscount,
      deliveryCarges,
      finalOrderAmount,
    };

    if (JSON.stringify(cartDetails) !== JSON.stringify(newDetails)) {
      setCartDetails(newDetails); // only update when different
    }
  }, [filteredCartItems, localCartItems]);

  if (error) return <p>An error occured.</p>;

  if (loading && !hydrated) {
    return <div>Loading cart...</div>;
  }

  const cartListing = filteredCartItems.map((item) => {
    const currentQty = localCartItems[item.product._id] || 0;
    return (
      <div key={item.product._id} className="mb-4">
        <Link
          className="text-decoration-none"
          to={`/products/details/${item.product._id}`}
        >
          <div className="card card-products">
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  className="img-fluid rounded-start card-img object-fit-cover"
                  src={`${item.product.imgUrl}`}
                  alt={`${item.product.title} image.`}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h6>{item.product.title}</h6>
                  <p>₹ {item.product.price}</p>
                  <div className="pb-2 pt-0">
                    <span>Quantity:</span>{" "}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(item.product._id);
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
                        removeFromCart(item.product._id);
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
        <div className="row">
          <div className="col-md-6">
            <h1 className="display-6 py-5">My Cart</h1>
          </div>
          <div className="col-md-6">
            <Link to={"/orders"} className="btn btn-second-custom my-5 float-end">
              View Past Orders
            </Link>
          </div>
        </div>

        {error && <p>An error occurred.</p>}
        {filteredCartItems.length === 0 && hydrated ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="row">
            <div className="col-md-6">
              <div className="row">{cartListing}</div>
            </div>
            <div className="col-md-6">
              {cartDetails && hydrated ? (
                <div className="card px-3 py-4 shadow-sm">
                  <h4>CART SUMMARY</h4>
                  <hr />
                  {
                    <>
                      <p>Items: {filteredCartItems.length}</p>
                      <p>Price: ₹{cartDetails.totalCartPrice}</p>
                      <p>
                        Discount: {cartDetails.totalCartDiscount > 0 ? "-" : ""}
                        ₹{cartDetails.totalCartDiscount}
                      </p>
                      <p>Delivery Charges: ₹{cartDetails.deliveryCarges}</p>
                      <hr className="mt-0" />
                      <p className="fw-bold">
                        FINAL AMOUNT: ₹{cartDetails.finalOrderAmount}
                      </p>
                      <hr className="mt-0" />
                      <p>
                        You will save ₹{cartDetails.totalCartDiscount} on this
                        order
                      </p>
                      <Link to="/checkout" className="btn btn-custom w-100">
                        Proceed to Checkout
                      </Link>
                    </>
                  }
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Cart;
