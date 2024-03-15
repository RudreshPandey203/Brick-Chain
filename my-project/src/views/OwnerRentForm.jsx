import React, { useState,useEffect } from 'react';
import { db, auth } from '../../firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth';


function OwnerRentForm() {

  const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const user = useAuthState(auth);

  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: '',
    address: '',
    rentAmount: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle form submission here, e.g., submit data to backend
    console.log(formData);
    await setDoc(doc(db,"rentals",userSession))
    // Reset form fields after submission
    setFormData({
      propertyName: '',
      propertyType: '',
      address: '',
      rentAmount: '',
      description: ''
    });
  };

  return (
    <div>
      <h2>Owner Rent Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Property Name:
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Property Type:
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Condo">Condo</option>
            {/* Add more options as needed */}
          </select>
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Rent Amount:
          <input
            type="number"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default OwnerRentForm;
