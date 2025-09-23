import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import ProductsContext from "../contexts/ProductsContext";
import useFetch from "../../useFetch";

const CheckoutPage = () => {
  const { API, userId, cartDetails } = useContext(ProductsContext);
  const { data, loading, error } = useFetch(`${API}/users/${userId}/details`);
  const navigate = useNavigate();

  const defaultAddress = data?.userDetails?.address?.find(
    (addr) => addr.isDefault
  );

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
            name: defaultAddress?.name,
            street: defaultAddress?.street,
            city: defaultAddress?.city,
            state: defaultAddress?.state,
            zip: defaultAddress?.zip,
            phone: defaultAddress?.phoneNumber,
          },
          status: "Shipped",
        }),
      });

      if (res.ok) {
        toast.success("Order placed successfully");
        navigate("/cart");
      } else {
        toast.error("Failed to place the order");
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
    return <p className="container loading-custom"> Loading Cart Details...</p>;
  }

  return (
    <>
      <main className="container">
        <h1 className="display-6 py-5">Secure Checkout</h1>
        <div className="card">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-sm-6 order-2 order-sm-1">
                {defaultAddress && (
                  <h5>Delivering to {defaultAddress?.name}</h5>
                )}
                {!defaultAddress && (
                  <p>Please select a default address to deliver the order.</p>
                )}
              </div>
              <div className="mb-3 mb-sm-1 col-sm-6 order-1 order-sm-2 text-start text-sm-end">
                <Link to="/address" className="btn btn-second-custom">
                  Change
                </Link>
              </div>
            </div>

            {defaultAddress && (
              <p>
                {defaultAddress?.street}, {defaultAddress?.city},{" "}
                {defaultAddress?.state}
              </p>
            )}

            {defaultAddress && <p>Contact number: {defaultAddress?.phone}</p>}

            <hr />
            <p>Price: ₹{cartDetails.totalCartPrice}</p>
            <p>Delivery Charges: ₹{cartDetails.deliveryCarges}</p>
            <hr className="mt-0" />
            <p className="fw-bold">
              FINAL AMOUNT: ₹{cartDetails.finalOrderAmount}
            </p>
            <button
              className="btn btn-custom"
              onClick={placeOrder}
              disabled={!defaultAddress}
            >
              Place Order
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default CheckoutPage;
