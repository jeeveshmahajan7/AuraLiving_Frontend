import { Link, Outlet, useLocation } from "react-router-dom";

const AccountLayout = () => {
  const location = useLocation();

  return (
    <>
      <main className="container">
        <h1 className="display-6 py-5">User Details</h1>

        <div className="row">
          <div className="col-md-3">
            <ul className="list-group mb-5">
              <Link
                to="profile"
                className={`list-group-item ${
                  location.pathname.includes("profile") ? "active-link" : ""
                }`}
              >
                Account
              </Link>
              <Link
                to="orders"
                className={`list-group-item ${
                  location.pathname.includes("orders") ? "active-link" : ""
                }`}
              >
                Order History
              </Link>
              <Link
                to="address/new"
                className={`list-group-item ${
                  location.pathname.includes("address/new") ? "active-link" : ""
                }`}
              >
                Add New Address
              </Link>
            </ul>
          </div>

          <div className="col-md-9">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default AccountLayout;
