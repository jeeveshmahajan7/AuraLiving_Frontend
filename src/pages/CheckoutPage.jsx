import { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import ProductsContext from "../contexts/ProductsContext";
import useFetch from "../../useFetch";

const CheckoutPage = () => {
  const { API, userId, cartDetails } = useContext(ProductsContext);
  const { data, loading, error } = useFetch(`${API}/users/${userId}/details`);
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      const res = await fetch(`${API}/users/${userId}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: cartDetails.cartItems.map((item) => ({
            product: item.product._id,
            quantity: item.quantity || 1,
            selectedSize: item.selectedSize || "M",
          })),
          totalPrice: cartDetails.finalOrderAmount,
          address: {
            name: data?.userDetails?.name,
            street: "House no 12, ABC Street",
            city: "Mumbai",
            state: "MH",
            zip: 400001,
            phone: 9876543210,
            // todo: change this static address, use user selected address
          },
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Order placed successfully!");
        navigate("/cart");
      } else {
        alert("❌ Failed: " + result.message);
      }
    } catch (error) {
      console.log(
        "Something went wrong while placing the order",
        error.message
      );
    }
  };

  if (error) return <p>An error occured.</p>;

  if (loading) {
    return <p>Loading Cart Details...</p>;
  }

  return (
    <>
      <main className="container">
        <h1 className="display-6 py-5">Secure Checkout</h1>
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <h5>Delivering to {data?.userDetails?.name}</h5>
              </div>
              <div className="col-sm-6 text-end">
                <Link
                  to="/address"
                  // todo: work here
                  className="btn btn-second-custom"
                >
                  Change
                </Link>
              </div>
            </div>
            <p>House no 12, ABC Street, Sector 10, Mumbai</p>
            <hr />
            <p>Price: ₹{cartDetails.totalCartPrice}</p>
            <p>Delivery Charges: ₹{cartDetails.deliveryCarges}</p>
            <hr className="mt-0" />
            <p className="fw-bold">
              FINAL AMOUNT: ₹{cartDetails.finalOrderAmount}
            </p>
            <button className="btn btn-custom" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
