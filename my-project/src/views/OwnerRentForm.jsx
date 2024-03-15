import React, { useState } from 'react';
import { doc, setDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config'
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { ImCross } from "react-icons/im";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  InfoWindow,
} from "@react-google-maps/api";
import { useAuthState } from "react-firebase-hooks/auth";

const mapContainerStyle = {
  width: "40vw",
  height: "70vh",
};

const libraries = ["places"];

function PropertyForm() {
  const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const user = useAuthState(auth);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [center, setCenter] = useState({ lat: 24.941553, lng: 82.127167 });
  const [autoComplete, setAutoComplete] = useState(null);
  const [error, setError] = useState("");

  

  const [personalDetails, setPersonalDetails] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [bedrooms, setBedrooms] = useState(1);
  const [balconies, setBalconies] = useState(1);
  const [totalFloors, setTotalFloors] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [price, setPrice] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      personalDetails,
      propertyType,
      city,
      locality,
      bedrooms,
      balconies,
      totalFloors,
      bathrooms,
      price,
      photos: [],
    };

    // Upload each selected image to Firebase Storage
    for (let i = 0; i < photos.length; i++) {
      const imageRef = ref(imageDb, `/rentals/${userSession}/${photos[i].name}`);
      await uploadBytesResumable(imageRef, photos[i]);
      const imageURL = await getDownloadURL(imageRef);
      formData.photos.push(imageURL);
    }

    try {
      await setDoc(doc(db, "rentals", userSession), formData);
      console.log("Property data submitted:", formData);

      // Reset form fields after submission
      setPersonalDetails('');
      setPropertyType('');
      setCity('');
      setLocality('');
      setBedrooms(1);
      setBalconies(1);
      setTotalFloors(1);
      setBathrooms(1);
      setPrice('');
      setPhotos([]);
      setImageURLs([]);
    } catch (error) {
      console.error("Error submitting property data:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Property Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Personal Details:</label>
          <div className="flex items-center space-x-4">
            <input type="radio" value="Owner" checked={personalDetails === 'Owner'} onChange={(e) => setPersonalDetails(e.target.value)} id="owner" />
            <label htmlFor="owner">Owner</label>
            <input type="radio" value="Agent" checked={personalDetails === 'Agent'} onChange={(e) => setPersonalDetails(e.target.value)} id="agent" />
            <label htmlFor="agent">Agent</label>
            <input type="radio" value="Builder" checked={personalDetails === 'Builder'} onChange={(e) => setPersonalDetails(e.target.value)} id="builder" />
            <label htmlFor="builder">Builder</label>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Property Type:</label>
          <div className="flex items-center space-x-4">
            <input type="radio" value="Sale" checked={propertyType === 'Sale'} onChange={(e) => setPropertyType(e.target.value)} id="sale" />
            <label htmlFor="sale">Sale</label>
            <input type="radio" value="Rent/Lease" checked={propertyType === 'Rent/Lease'} onChange={(e) => setPropertyType(e.target.value)} id="rent" />
            <label htmlFor="rent">Rent/Lease</label>
            <input type="radio" value="PG/Hostel" checked={propertyType === 'PG/Hostel'} onChange={(e) => setPropertyType(e.target.value)} id="pg" />
            <label htmlFor="pg">PG/Hostel</label>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Locality:</label>
          <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Bedrooms:</label>
          <input type="number" value={bedrooms} min="1" onChange={(e) => setBedrooms(parseInt(e.target.value))} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Balconies:</label>
          <input type="number" value={balconies} min="1" onChange={(e) => setBalconies(parseInt(e.target.value))} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Total Floors:</label>
          <input type="number" value={totalFloors} min="1" onChange={(e) => setTotalFloors(parseInt(e.target.value))} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Bathrooms:</label>
          <input type="number" value={bathrooms} min="1" onChange={(e) => setBathrooms(parseInt(e.target.value))} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Price:</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Photos:</label>
          <input type="file" multiple onChange={(e) => setPhotos(e.target.files)} className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:border-blue-500" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Submit</button>
      </form>
    </div>
  );
}

export default PropertyForm;