import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

import Header from "../components/Header";

const Home = () => {
  return (
    <>
      <Header />

      <main className="bg-body-tertiary">
        <div className="container">
          <div className="w-50 py-5">
            <h1 className="display-4">
              STYLE EVERY CORNER OF YOUR HOME WITH EASE
            </h1>
          </div>
          <hr className="my-0" />

          <h2 className="display-6 w-50 py-4 mb-0">CATEGORIES</h2>
          <div className="row pb-3">
            <div className="col-md-4">
              <div className="card mb-5">
                <Link to="/products/furniture">
                  <img
                    src="https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg"
                    alt="Furniture Image"
                    className="card-img img-fluid object-fit-cover"
                  />

                  {/* dark overlay on image */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 image-overlay"></div>

                  {/* text content */}
                  <div className="card-img-overlay d-flex align-items-center justify-content-center text-on-top">
                    <h4 className="card-text fs-2">Furniture</h4>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-5">
                <Link to="/products/lamp">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1668005190411-1042cd38522e?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Lamp Image"
                    className="card-img img-fluid object-fit-cover"
                  />

                  {/* image overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 image-overlay"></div>

                  <div className="card-img-overlay d-flex align-items-center justify-content-center text-on-top">
                    <h4 className="card-text fs-2">Lamps</h4>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-5">
                <Link to="/products/vase">
                  <img
                    src="https://images.unsplash.com/photo-1612120867524-e3f3c59f4240?q=80&w=1050&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Vase Image"
                    className="card-img img-fluid object-fit-cover"
                  />

                  {/* image overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 image-overlay"></div>

                  <div className="card-img-overlay d-flex align-items-center justify-content-center text-on-top">
                    <h4 className="card-text fs-2">Vases</h4>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-5">
                <Link to="/products/wall%20art">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1706152482966-a295c922cdcf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Wall Art Image"
                    className="card-img img-fluid object-fit-cover"
                  />

                  {/* image overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 image-overlay"></div>

                  <div className="card-img-overlay d-flex align-items-center justify-content-center text-on-top">
                    <h4 className="card-text fs-2">Wall Art</h4>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-5">
                <Link to="/products/plant">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1677666021181-35c0a6336a68?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Plants Image"
                    className="card-img img-fluid object-fit-cover"
                  />

                  {/* image overlay */}
                  <div className="position-absolute top-0 start-0 w-100 h-100 image-overlay"></div>

                  <div className="card-img-overlay d-flex align-items-center justify-content-center text-on-top">
                    <h4 className="card-text fs-2">Plants</h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
