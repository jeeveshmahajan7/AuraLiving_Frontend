import { Link } from "react-router-dom";
import { AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { FaUserAlt } from "react-icons/fa";
import { useLocation, matchPath } from "react-router-dom";
import { useContext, useEffect } from "react";
import ProductsContext from "../contexts/ProductsContext";

const Header = () => {
  const { searchQuery, setSearchQuery, localCartItems, localFavoriteIds } =
    useContext(ProductsContext);

  const cartSize = Object.values(localCartItems).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const loaction = useLocation();
  const isInsideProductListingPage =
    matchPath("/products", loaction.pathname) ||
    matchPath("/products/:category", loaction.pathname);

  return (
    <>
      <p className="text-center py-2 shipping-banner mb-0">
        *FAST AND FREE SHIPPING ON ORDERS ABOVE ₹499!*
      </p>
      <nav className="navbar navbar-expand-md">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">
            AuraLiving
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {isInsideProductListingPage && (
              <form
                className="ms-auto"
                role="search"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="form-control my-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            )}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-md-2">
                {/* <Link to="" className="btn btn-custom">
                  Login
                </Link> */}
                {/* todo: Use this while implementing login functionality */}
                <Link to="/account" className="nav-link">
                  <FaUserAlt color="black" size={16} /> Account
                </Link>
              </li>
              <li className="nav-item mx-md-2">
                <Link to="/favorites" className="nav-link">
                  <AiFillHeart color="red" size={20} /> Favorites
                </Link>
              </li>
              <li className="nav-item mx-md-2">
                <Link to="/cart" className="nav-link">
                  <AiOutlineShoppingCart color="black" size={20} /> Cart(
                  <span>{cartSize}</span>)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
