import React, { useState } from 'react';

function PropertyForm() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., send data to backend
    console.log({
      personalDetails,
      propertyType,
      city,
      locality,
      bedrooms,
      balconies,
      totalFloors,
      bathrooms,
      price,
      photos
    });
    // Reset form fields
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
  };

  return (
    <div className="property-form">
      <h2>Property Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Personal Details:
            <input type="radio" value="Owner" checked={personalDetails === 'Owner'} onChange={(e) => setPersonalDetails(e.target.value)} /> Owner
            <input type="radio" value="Agent" checked={personalDetails === 'Agent'} onChange={(e) => setPersonalDetails(e.target.value)} /> Agent
            <input type="radio" value="Builder" checked={personalDetails === 'Builder'} onChange={(e) => setPersonalDetails(e.target.value)} /> Builder
          </label>
        </div>
        <div>
          <label>
            Property Type:
            <input type="radio" value="Sale" checked={propertyType === 'Sale'} onChange={(e) => setPropertyType(e.target.value)} /> Sale
            <input type="radio" value="Rent/Lease" checked={propertyType === 'Rent/Lease'} onChange={(e) => setPropertyType(e.target.value)} /> Rent/Lease
            <input type="radio" value="PG/Hostel" checked={propertyType === 'PG/Hostel'} onChange={(e) => setPropertyType(e.target.value)} /> PG/Hostel
          </label>
        </div>
        <div>
          <label>
            City:
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Locality:
            <input type="text" value={locality} onChange={(e) => setLocality(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Bedrooms:
            <input type="number" value={bedrooms} min="1" onChange={(e) => setBedrooms(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Balconies:
            <input type="number" value={balconies} min="1" onChange={(e) => setBalconies(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Total Floors:
            <input type="number" value={totalFloors} min="1" onChange={(e) => setTotalFloors(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Bathrooms:
            <input type="number" value={bathrooms} min="1" onChange={(e) => setBathrooms(parseInt(e.target.value))} />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Photos:
            <input type="file" multiple onChange={(e) => setPhotos(e.target.files)} />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PropertyForm;
