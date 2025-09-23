import { useContext, useEffect, useState } from "react";

import ProductsContext from "../contexts/ProductsContext";

const Profile = () => {
  const { API, userId } = useContext(ProductsContext);
  const [defaultAddress, setDefaultAddress] = useState("");

  const fetchUserAddress = async () => {
    try {
      const res = await fetch(`${API}/users/${userId}/details`);

      if (!res.ok) {
        console.log("Failed to fetch user data, status:", res.status);
        return;
      }

      const data = await res.json();

      data.userDetails.address.forEach((user) => {
        if (user.isDefault == true) {
          setDefaultAddress(user);
        }
      });
    } catch (error) {
      console.log("Failed to fetch user data:", error.message);
    }
  };

  useEffect(() => {
    fetchUserAddress();
  }, []);

  return (
    <div>
      <h5 className="mb-4">Profile Details</h5>
      {!defaultAddress && (
        <p className="container loading-custom">Loading Address Details...</p>
      )}
      {defaultAddress && (
        <>
          <p>Full Name: {defaultAddress.name}</p>
          <p>Phone Number: {defaultAddress.phone}</p>
          <p>
            Address: {defaultAddress.street}, {defaultAddress.city},{" "}
            {defaultAddress.state} - {defaultAddress.zip}
          </p>
        </>
      )}
    </div>
  );
};

export default Profile;
