import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductsContext from "../contexts/ProductsContext";

const ProductsFilterContent = () => {
  const {
    priceUpperLimit,
    minimumRating,
    selectedCategories,
    setPriceUpperLimit,
    setSelectedCategories,
    setMinimumRating,
    setSortingRule,
    setSearchQuery,
  } = useContext(ProductsContext);

  const navigate = useNavigate(); // to handle navigation on clearing filters

  const { category } = useParams(); // category selected from the home page cards

  // to check the category by default when navigating via a category card from home page
  useEffect(() => {
    if (category) {
      setSelectedCategories([`${category}`]);
    }
  }, [category, setSelectedCategories]);

  const handlePriceRange = (event) => {
    setPriceUpperLimit(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedCategories((prevValue) => [...prevValue, value.toLowerCase()]);
    } else {
      setSelectedCategories((prevValue) =>
        prevValue.filter((category) => category !== value.toLowerCase())
      );
    }
  };

  const handleRatingChange = (event) => {
    setMinimumRating(event.target.value);
  };

  const handleClearFiltersClick = () => {
    setPriceUpperLimit(10000);
    setSelectedCategories([]);
    setMinimumRating(0);
    setSortingRule(""); // to clear sort on click of Show All Products i.e. clear filters button
    setSearchQuery(""); // to remove search query from the search bar
    navigate("/products"); // navigate to the products listing page, clears the /:category route to remove default filter
  };

  return (
    <>
      <div className="accordion accordion-flush" id="filtersAccordion">
        <div className="accordion-item">
          <h5 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#price"
              aria-expanded="false"
              aria-controls="price"
            >
              PRICE
            </button>
          </h5>
          <div
            id="price"
            className="accordion-collapse collapse"
            data-bs-parent="#filtersAccordion"
          >
            <div className="py-2">
              <input
                type="range"
                className="form-range px-2"
                id="priceRange"
                min={0}
                max={10000}
                // todo: find max value from the data objects and then use here
                value={priceUpperLimit}
                onChange={(event) => handlePriceRange(event)}
              />
              <output
                className="px-2"
                htmlFor="priceRange"
                id="priceRangeValue"
              >
                ₹0 - ₹{priceUpperLimit}
              </output>
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h5 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#category"
              aria-expanded="false"
              aria-controls="category"
            >
              CATEGORY
            </button>
          </h5>
          <div
            id="category"
            className="accordion-collapse collapse"
            data-bs-parent="#filtersAccordion"
          >
            <div className="accordion-body">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="Furniture"
                    checked={selectedCategories.includes(
                      "Furniture".toLowerCase()
                    )} // checked status controlled by state
                    onChange={(event) => handleCategoryChange(event)}
                  />
                  Furniture
                </label>
                <br />
              </div>

              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="Lamp"
                    checked={selectedCategories.includes("Lamp".toLowerCase())}
                    onChange={(event) => handleCategoryChange(event)}
                  />
                  Lamps
                </label>
                <br />
              </div>

              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="Vase"
                    checked={selectedCategories.includes("Vase".toLowerCase())}
                    onChange={(event) => handleCategoryChange(event)}
                  />
                  Vases
                </label>
                <br />
              </div>

              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="Wall Art"
                    checked={selectedCategories.includes(
                      "Wall Art".toLowerCase()
                    )}
                    onChange={(event) => handleCategoryChange(event)}
                  />
                  Wall Art
                </label>
                <br />
              </div>

              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value="Plant"
                    checked={selectedCategories.includes("Plant".toLowerCase())}
                    onChange={(event) => handleCategoryChange(event)}
                  />
                  Plants
                </label>
                <br />
              </div>
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h5 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#rating"
              aria-expanded="false"
              aria-controls="rating"
            >
              RATING
            </button>
          </h5>
          <div
            id="rating"
            className="accordion-collapse collapse"
            data-bs-parent="#filtersAccordion"
          >
            <div className="accordion-body py-2">
              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="rating"
                    checked={minimumRating === 4} // sets checked attribute to true if the selected minimumRating state matches the value of the radio
                    value={4}
                    onChange={(event) => handleRatingChange(event)}
                  />
                  4 Stars & above
                </label>
              </div>

              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="rating"
                    checked={minimumRating === 3}
                    value={3}
                    onChange={(event) => handleRatingChange(event)}
                  />
                  3 Stars & above
                </label>
              </div>

              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="rating"
                    checked={minimumRating === 2}
                    value={2}
                    onChange={(event) => handleRatingChange(event)}
                  />
                  2 Stars & above
                </label>
              </div>

              <div className="form-check">
                <label className="form-check-label">
                  <input
                    type="radio"
                    className="form-check-input"
                    name="rating"
                    checked={minimumRating === 1}
                    value={1}
                    onChange={(event) => handleRatingChange(event)}
                  />
                  1 Star & above
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* <div className="col-12"> */}
        <button
          onClick={handleClearFiltersClick}
          className="btn btn-custom w-100 my-4"
        >
          SHOW ALL PRODUCTS
        </button>
        {/* </div> */}
      </div>
    </>
  );
};

export default ProductsFilterContent;
