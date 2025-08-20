import { useContext } from "react";
import ProductsContext from "../contexts/ProductsContext";

const ProductsSort = () => {
  const { sortingRule, setSortingRule } = useContext(ProductsContext);

  const handleSorting = (event) => {
    setSortingRule(event.target.value);
  };

  return (
    <>
      <div className="dropdown">
        <button
          className="btn btn-second-custom dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          SORT BY
        </button>
        <ul className="dropdown-menu px-1 py-2">
          <li className="form-check dropdown-item-text">
            <label htmlFor="lowToHigh" className="form-check-label ms-2">
              <input
                type="radio"
                id="lowToHigh"
                className="form-check-input"
                name="price"
                value="lowToHigh"
                checked={sortingRule.includes("lowToHigh")}
                onChange={(event) => handleSorting(event)}
              />
              Price: Low to High
            </label>
          </li>
          <li className="form-check dropdown-item-text">
            <label htmlFor="highToLow" className="form-check-label ms-2">
              <input
                type="radio"
                className="form-check-input"
                id="highToLow"
                name="price"
                value="highToLow"
                checked={sortingRule.includes("highToLow")}
                onChange={(event) => handleSorting(event)}
              />
              Price: High to Low
            </label>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProductsSort;
