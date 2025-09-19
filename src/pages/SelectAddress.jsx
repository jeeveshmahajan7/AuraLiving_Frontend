import { Link, useLocation } from "react-router-dom";
import { BiTrash } from "react-icons/bi";
import { toast } from "react-toastify";

import ProductsContext from "../contexts/ProductsContext";
import { useContext, useState, useEffect } from "react";

const SelectAddress = () => {
  const { API, userId } = useContext(ProductsContext);
  const [addressFormVisibility, setAddressFormVisibility] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null); // to track whether to edit/add address

  const [addressName, setAddressName] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressZipcode, setAddressZipcode] = useState("");
  const [addressPhoneNumber, setAddressPhoneNumber] = useState("");
  const [isAddressDefault, setIsAddressDefault] = useState(false);

  // to hide the heading on the account page
  const location = useLocation();
  const isInsideAccount = location.pathname.startsWith("/account");

  // fetching initial data to store in local state for instant UI changes
  const fetchInitialUserData = async () => {
    try {
      const res = await fetch(`${API}/users/${userId}/details`);

      if (res.ok) {
        const data = await res.json();
        setAddresses(data.userDetails.address || []);
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
        toast.error("Address Deletion Unsuccessfull");
        return;
      } else {
        setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
        toast.success("Address Deleted Successfully");
      }
    } catch (error) {
      console.log("Error deleting address:", error.message);
    }
  };

  const handleNewAddressAddition = async () => {
    closeForm();
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
        toast.error("Failed to add address");
        return;
      }

      // 👇 expect backend to return the saved address with _id
      const newAddressFromDB = await res.json();

      setAddresses((prev) => {
        // if new address is default, reset isDefault of old ones
        if (newAddressFromDB.isDefault) {
          return [
            ...prev.map((addr) => ({ ...addr, isDefault: false })),
            newAddressFromDB,
          ];
        }
        return [...prev, newAddressFromDB];
      });
      toast.success("Address added successfully");
    } catch (error) {
      toast.error("Failed to add address");
    }
  };

  const handleDefaultAddress = async (addressId) => {
    try {
      const res = await fetch(
        `${API}/users/${userId}/address/${addressId}/default`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) {
        toast.error("Failed to update default address");
        return;
      }

      // optimistically update UI for instant changes
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr._id === addressId,
        }))
      );

      toast.success("Default address updated");
    } catch (error) {
       toast.error("Error updating default address");
    }
  };

  const triggerAddressUpdation = async (addressId) => {
    const addrToEdit = addresses.find((addr) => addr._id === addressId);
    if (!addrToEdit) return;
    setEditingAddressId(addressId);
    setAddressName(addrToEdit.name);
    setAddressStreet(addrToEdit.street);
    setAddressCity(addrToEdit.city);
    setAddressState(addrToEdit.state);
    setAddressZipcode(addrToEdit.zip);
    setAddressPhoneNumber(addrToEdit.phone);
    setIsAddressDefault(addrToEdit.isDefault);

    setAddressFormVisibility(true);
  };

  const handleAddressUpdation = async (editingAddressId) => {
    try {
      const updatedAddress = {
        name: addressName,
        street: addressStreet,
        city: addressCity,
        state: addressState,
        zip: addressZipcode,
        phone: addressPhoneNumber,
        isDefault: isAddressDefault,
      };

      const res = await fetch(
        `${API}/users/${userId}/address/${editingAddressId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAddress),
        }
      );

      if (!res.ok) {
        toast.error("Failed to update address");
        return;
      }

      // Update local state
      setAddresses((prev) =>
        prev.map((addr) => {
          if (addr._id === editingAddressId) {
            return { ...addr, ...updatedAddress };
          } else if (updatedAddress.isDefault) {
            // reset other addresses if new one is default
            return { ...addr, isDefault: false };
          } else {
            return addr;
          }
        })
      );

      toast.success("Address updated successfully");

      // reset modal state
      closeForm();
      setEditingAddressId(null);
    } catch (error) {
      toast.error("Error updating address");
    }
  };

  // to reset the form input fields back to blank for fresh form
  const resetForm = () => {
    setEditingAddressId(null);
    setAddressName("");
    setAddressStreet("");
    setAddressCity("");
    setAddressState("");
    setAddressZipcode("");
    setAddressPhoneNumber("");
    setIsAddressDefault(false);
  };

  const closeForm = () => {
    setAddressFormVisibility(false);
    resetForm();
  };

  return (
    <>
      <main className="container">
        {!isInsideAccount && (
          <h1 className="display-6 py-5">Select a delivery address</h1>
        )}
        <div className="row mb-4 align-items-center">
          <div className="col-md-6">
            <h5>Delivery Addresses ({addresses?.length ?? 0})</h5>
          </div>
          <div className="col-md-6 text-md-end">
            <Link
              onClick={() => setAddressFormVisibility(true)}
              className="btn btn-second-custom"
            >
              Add New Address
            </Link>
          </div>
        </div>

        {/* todo: add delivery address count */}
        {addresses && addresses.length > 0 && (
          <ul className={`list-group ${isInsideAccount ? "mb-5" : ""}`}>
            {addresses.map((addr) => (
              <li key={addr._id || index} className="list-group-item">
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
                <div className="d-flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      triggerAddressUpdation(addr._id);
                    }}
                    className="btn btn-second-custom btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    className={`btn btn-sm ${
                      addr.isDefault ? "btn-custom" : "btn-second-custom"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDefaultAddress(addr._id);
                    }}
                  >
                    {addr.isDefault ? "Default Address" : "Set as default"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!isInsideAccount && (
          <>
            <hr />
            <Link to="/checkout" className="btn btn-custom mb-5">
              Save Defaults
            </Link>
          </>
        )}

        {addressFormVisibility && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog mt-5">
              <div className="modal-content">
                <div className="modal-header">
                  <p className="modal-title">
                    {editingAddressId ? "Edit address" : "Add an address"}
                  </p>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => closeForm()}
                  ></button>
                </div>
                <div className="modal-body">
                  <h5 className="pb-3">Enter a New Delivery Address</h5>
                  {/* form to add new delivery address */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (editingAddressId) {
                        handleAddressUpdation(editingAddressId);
                      } else {
                        handleNewAddressAddition();
                      }
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
                        value={addressName}
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
                        value={addressStreet}
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
                        value={addressCity}
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
                        value={addressState}
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
                        value={addressZipcode}
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
                        value={addressPhoneNumber}
                        required
                        onChange={(e) => setAddressPhoneNumber(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label" htmlFor="isDefault">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isAddressDefault}
                          onChange={(e) =>
                            setIsAddressDefault(e.target.checked)
                          }
                        />{" "}
                        Make this my default address
                      </label>
                    </div>

                    <button className="btn btn-custom" type="submit">
                      {editingAddressId ? "Save changes" : "Use this address"}
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
