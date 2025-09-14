import useFetch from "../../useFetch";
import { Link } from "react-router-dom";
import { BiTrash } from "react-icons/bi";

import ProductsContext from "../contexts/ProductsContext";
import { useContext, useState, useEffect } from "react";

const SelectAddress = () => {
  const { API, userId } = useContext(ProductsContext);
  const [addressFormVisibility, setAddressFormVisibility] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const [addressName, setAddressName] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZipcode, setAddressZipcode] = useState("");
  const [addressPhoneNumber, setAddressPhoneNumber] = useState("");
  const [isAddressDefault, setIsAddressDefault] = useState(false);

  // fetching initial data to store in local state for instant UI changes
  const fetchInitialUserData = async () => {
    try {
      const res = await fetch(`${API}/users/${userId}/details`);

      if (res.ok) {
        const data = await res.json();
        setAddresses(data.userDetails.address || []);
        console.log(data);
      } else {
        console.log("Failed to fetch user data, status:", res.status);
      }
    } catch (error) {
      console.log("Failed to fetch user data:", error.message);
    }
  };

  useEffect(() => {
    fetchInitialUserData();
  }, []);

  const handleAddressDeletion = async (addressId) => {
    try {
      const res = await fetch(`${API}/users/${userId}/address/${addressId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Address Deletion Unsuccessfull! ❌");
        return;
      } else {
        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        alert("Address Deleted Successfully.");
      }
    } catch (error) {
      console.log("Error deleting address:", error.message);
    }
  };

  const handleNewAddressAddition = async () => {
    setAddressFormVisibility(false);
    try {
      const addressDetails = {
        name: addressName,
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zip: addressZipcode,
        phone: addressPhoneNumber,
        isDefault: isAddressDefault,
      };

      const res = await fetch(`${API}/users/${userId}/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressDetails),
      });

      if (!res.ok) {
        alert("Failed to add address. ❌");
        return;
      } else {
        setAddresses((prev) => [...prev, addressDetails]);
        alert("Address added successfully! ✅");
      }
    } catch (error) {
      alert("Failed to save address:", error.message);
    }
  };

  return (
    <>
      <main className="container">
        <h1 className="display-6 py-5">Select a delivery address</h1>
        <h5>Delivery Addresses ({addresses.length})</h5>
        {/* todo: add delivery address count */}
        {addresses && addresses.length > 0 && (
          <ul className="list-group">
            {addresses.map((addr) => (
              <li key={addr._id} className="list-group-item">
                <div className="row">
                  <div className="col-md-8">
                    <p>{addr.name}</p>
                  </div>
                  <div className="col-md-4 d-flex justify-content-end">
                    <button className="btn btn-second-custom">
                      <BiTrash
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddressDeletion(addr._id);
                        }}
                      />
                    </button>
                  </div>
                </div>
                <p>
                  {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                </p>
                <p>Phone: {addr.phone}</p>
              </li>
            ))}
          </ul>
        )}
        <hr />
        <Link
          onClick={() => setAddressFormVisibility(true)}
          className="btn btn-second-custom mb-5"
        >
          Add New Address
        </Link>

        {addressFormVisibility && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog mt-5">
              <div className="modal-content">
                <div className="modal-header">
                  <p className="modal-title">Add an address</p>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setAddressFormVisibility(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <h5 className="pb-3">Enter a New Delivery Address</h5>
                  {/* form to add new delivery address */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNewAddressAddition();
                    }}
                  >
                    <div className="mb-3">
                      <label className="form-label" htmlFor="name">
                        Name:
                      </label>
                      <input
                        className="form-control"
                        id="name"
                        name="name"
                        type="text"
                        required
                        onChange={(e) => setAddressName(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="street">
                        Street:
                      </label>
                      <input
                        className="form-control"
                        id="street"
                        name="street"
                        type="text"
                        required
                        onChange={(e) => setAddressStreet(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="city">
                        City:
                      </label>
                      <input
                        className="form-control"
                        id="city"
                        name="city"
                        type="text"
                        required
                        onChange={(e) => setAddressCity(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="state">
                        State:
                      </label>
                      <input
                        className="form-control"
                        id="state"
                        name="state"
                        type="text"
                        required
                        onChange={(e) => setAddressState(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="zipCode">
                        Zip Code: (6 digits only)
                      </label>
                      <input
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        inputMode="numeric" // mobile shows number keypad
                        pattern="[0-9]{6}"
                        minLength={6}
                        maxLength={6}
                        required
                        onChange={(e) => setAddressZipcode(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="phoneNumber">
                        Phone Number: (10 digits only)
                      </label>
                      <input
                        className="form-control"
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        minLength={10}
                        maxLength={10}
                        required
                        onChange={(e) => setAddressPhoneNumber(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="isDefault">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          onChange={(e) =>
                            setIsAddressDefault(e.target.checked)
                          }
                        />{" "}
                        Make this my default address
                      </label>
                    </div>

                    <button className="btn btn-custom" type="submit">
                      Use this address
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default SelectAddress;
