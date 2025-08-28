import { useState } from "react";
import { useContext } from "react";

import ProductsList from "../components/ProductsList";
import ProductsFilterContent from "../components/ProductsFilterContent";
import ProductsSort from "../components/ProductsSort";
import ProductsContext from "../contexts/ProductsContext";

const ProductsListing = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { filteredProductsLength } = useContext(ProductsContext);

  return (
    <>
      <main className="container">
        <div className="row py-5">
          <div className="col-md-3">
            <p className="small">
              Explore our curated range of products to elevate every part of
              your home.
            </p>
          </div>
          <div className="col-md-9">
            <h1 className="display-4">ALL YOUR FAVORITES IN ONE PLACE</h1>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-md-3 col-6 d-flex justify-content-start">
            <div className="accordion accordion-flush" id="accordionFilters">
              <div className="accordion-item">
                <h5 className="accordion-header">
                  <button
                    className="accordion-button collapsed no-chevron py-2 pe-1"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#filtersCollapse"
                    aria-expanded="false"
                    aria-controls="filtersCollapse"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    FILTERS
                    <span className="ms-auto">
                      <i className="bi bi-list" />
                      {/* Bootstrap icon for 3 lines */}
                    </span>
                  </button>
                </h5>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-6">
            <div className="row">
              <div className="col-md-6 d-flex justify-content-start align-items-center">
                <div className="d-none d-md-block">
                  {/* to show products count on md to large screens */}
                  Showing {filteredProductsLength} products.
                </div>
              </div>
              <div className="col-md-6 d-flex justify-content-end">
                {<ProductsSort />}
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-6 col-md-3">
            <div className="row">
              <div
                id="filtersCollapse"
                className={`collapse ${showFilters ? "show" : ""} d-md-block`}
              >
                {<ProductsFilterContent />}
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="d-flex justify-content-center d-block d-md-none mb-3">
              {/* to show products count on small screens */}
              Showing {filteredProductsLength} products.
            </div>
            <div className="row">{<ProductsList />}</div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductsListing;
