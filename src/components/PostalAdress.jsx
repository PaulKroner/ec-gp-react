// import { AuthContext } from "@/app/context/AuthContext";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PostalAdress = ({ formData, setFormData }) => {
  const { userRole, isAuthenticated } = useContext(AuthContext);
  const [postalData, setPostalData] = useState({
    street: "",
    housenumber: "",
    zip: "",
    city: "",
    additional: "",
  });

  // UseEffect to split the formData.postadresse
  useEffect(() => {
    // Check if postadresse is neither "keine Postadresse" nor an empty string
    if (formData.postadresse !== "keine Postadresse" && formData.postadresse !== "") {
      const addressParts = formData.postadresse.split(", ");

      // Ensure there are at least two parts: street + housenumber and zip + city
      if (addressParts.length >= 2) {
        // Split street and house number
        const streetAndHouse = addressParts[0].split(" ");
        const street = streetAndHouse.slice(0, -1).join(" "); // Join all but the last element as street
        const housenumber = streetAndHouse[streetAndHouse.length - 1]; // Last element as housenumber

        // Split zip and city
        const zipAndCity = addressParts[1].split(" ");
        const zip = zipAndCity[0]; // First element as zip
        const city = zipAndCity.slice(1).join(" "); // Join all but the first element as city

        // Handle additional address information if present
        const additional = addressParts.length > 2 ? addressParts[2] : "";

        // Update postalData with extracted values
        setPostalData({
          street,
          housenumber,
          zip,
          city,
          additional,
        });
      } else {
        // Reset postalData if the address format is unexpected
        setPostalData({
          street: "",
          housenumber: "",
          zip: "",
          city: "",
          additional: "",
        });
      }
    } else {
      // Reset postalData if postadresse is "keine Postadresse" or empty
      setPostalData({
        street: "",
        housenumber: "",
        zip: "",
        city: "",
        additional: "",
      });
    }
  }, []);

  const handlePostalChange = (e) => {
    const { id, value } = e.target;

    let updatedPostalData = { ...postalData };

    // ZIP code validation: allow only numbers and max length of 5
    if (id === "zip") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (numericValue.length > 5) return; // Prevent input longer than 5 digits

      // Update postalData with the valid numeric value for zip
      updatedPostalData = {
        ...postalData,
        [id]: numericValue,
      };
    } else {
      updatedPostalData = {
        ...postalData,
        [id]: value,
      };
    }

    setPostalData(updatedPostalData);

    // Concatenate the address into a single string, handling spaces and commas properly
    const fullAddress = `${updatedPostalData.street || ""} ${updatedPostalData.housenumber || ""}, ${updatedPostalData.zip || ""} ${updatedPostalData.city || ""}${updatedPostalData.additional ? `, ${updatedPostalData.additional}` : ""}`.replace(/\s+,/g, ",");

    // Update formData with the new address string
    setFormData((prevData) => ({
      ...prevData,
      postadresse: fullAddress.trim(),
    }));
  };

  return (
    <>
      <div className="grid grid-cols-6 items-center gap-4">
        <Label htmlFor="postadresse" className="col-span-2">Postadresse</Label>

        {userRole === 1 && isAuthenticated === true ? (
          <>
            {/* Street Input */}
            <Input
              type="text"
              id="street"
              value={postalData.street}
              onChange={handlePostalChange}
              className="col-span-2"
              placeholder="Straße"
            />

            {/* House Number Input */}
            <Input
              type="text"
              id="housenumber"
              value={postalData.housenumber}
              onChange={handlePostalChange}
              className="col-span-1"
              placeholder="Nr."
            />

            {/* empty div for spacing */}
            <div className="col-span-2"></div>
          </>
        ) : (
          <></>
        )}

        {/* ZIP Code Input */}
        <Input
          type="text"
          id="zip"
          value={postalData.zip}
          onChange={handlePostalChange}
          className="col-span-1"
          placeholder="PLZ"
        />

        {/* City Input */}
        <Input
          type="text"
          id="city"
          value={postalData.city}
          onChange={handlePostalChange}
          className="col-span-2"
          placeholder="Ort"
        />

        {userRole === 1 && isAuthenticated === true ? (
          <>
            {/* empty div for spacing */}
            <div className="col-span-2"></div>

            {/* additional Input */}
            <Input
              type="text"
              id="additional"
              value={postalData.additional}
              onChange={handlePostalChange}
              className="col-span-2"
              placeholder="Zusatz"
            />

          </>) : (
          <></>
        )}
      </div >
    </>
  );
};

export default PostalAdress;
