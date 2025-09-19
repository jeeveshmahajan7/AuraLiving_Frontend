import useFetch from "../../useFetch";
import { useContext } from "react";
import ProductsContext from "../contexts/ProductsContext";
import { useLocation } from "react-router-dom";

const Orders = () => {
  const { API, userId } = useContext(ProductsContext);
  const { data, loading, error } = useFetch(`${API}/users/${userId}/orders`);

  // to hide the heading on the account page
  const location = useLocation();
  const isInsideAccount = location.pathname.startsWith("/account");

  const ordersListing = loading ? (
    <p className="container loading-custom">Loading orders...</p>
  ) : error ? (
    <p className="text-danger">{error}</p>
  ) : data && data.orders && data.orders.length > 0 ? (
    data.orders.map((order) => (
      <div key={order._id} className="card mb-4 shadow-sm">
        <div className="card-body">
          <p className="card-title">
            Order #{order._id.slice(-6).toUpperCase()}
          </p>
          <h4 className="mb-2">{order.address.name}</h4>
          <p className="mb-1">
            <strong>Status:</strong> {order.status}
          </p>
          <p className="mb-1">
            <strong>Total:</strong> ₹{order.totalPrice}
          </p>
          <p className="mb-1">
            <strong>Ordered At:</strong>{" "}
            {new Date(order.orderedAt).toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Shipping Address:</strong> {order.address.street},{" "}
            {order.address.city}, {order.address.state} - {order.address.zip}
          </p>

          <ul className="list-group">
            {order.products.map((item) => (
              <li
                key={item._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {item.product?.title || "Unknown Product"} <br />
                  Size: {item.selectedSize}
                </span>
                <span className="badge orange-bg rounded-pill">
                  Qty: {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    ))
  ) : (
    <p>No orders found.</p>
  );

  return (
    <>
      <main className="container">
        {!isInsideAccount && <h1 className="display-6 py-5">Order History</h1>}
        {ordersListing}
      </main>
    </>
  );
};

export default Orders;
