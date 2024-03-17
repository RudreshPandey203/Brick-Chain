import React, { useState, useEffect } from "react";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/config";

import { useNavigate } from "react-router-dom";
// import { ImCross } from "react-icons/im";
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
  const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;

  const [formData, setFormData] = useState({
    heluhelu: "",
    propertyName: "",
    latitude: 0,
    longitude: 0,
    saleCost: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    address: "",
    images : "",
  });
  const [owner] = useAuthState(auth);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [center, setCenter] = useState({ lat: 24.941553, lng: 82.127167 });
  const [autoComplete, setAutoComplete] = useState(null);
  const [error, setError] = useState("");
  const Navigate = useNavigate();
  const [img, setImg] = useState("");
  //Map code:
  const getAddressComponent = (addressComponents, type) => {
    const addressComponent = addressComponents.find((component) =>
      component.types.includes(type)
    );
    return addressComponent ? addressComponent.long_name : "";
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          try {
            const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
              position.coords.latitude
            },${
              position.coords.longitude
            }&key=${-Your-Google-Maps-API-Key-}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.status === "OK" && data.results.length > 0) {
              const result = data.results[0];
              setFormData({
                ...formData,
                address: result.formatted_address,
                city: getAddressComponent(
                  result.address_components,
                  "locality"
                ),
                state: getAddressComponent(
                  result.address_components,
                  "administrative_area_level_1"
                ),
                pincode: getAddressComponent(
                  result.address_components,
                  "postal_code"
                ),
                country: getAddressComponent(
                  result.address_components,
                  "country"
                ),
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
          }
          const response = await fetch(apiUrl);
          const data = await response.json();
          if (data.status === "OK" && data.results.length > 0) {
            const result = data.results[0];
            setFormData({
              ...formData,
              address: result.formatted_address,
              city: getAddressComponent(result.address_components, "locality"),
              state: getAddressComponent(
                result.address_components,
                "administrative_area_level_1"
              ),
              pincode: getAddressComponent(
                result.address_components,
                "postal_code"
              ),
              country: getAddressComponent(
                result.address_components,
                "country"
              ),
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }
        } catch (error) {
          console.error("Error fetching location details:", error);
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const handlePlaceSelect = (place) => {
    if (place.geometry) {
      setFormData({
        ...formData,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      });
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleLocationSelect = () => {
    setFormData({
      ...formData,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
    });
    setSelectedLocation(null);
  };

  const picChange = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      setFormData({ ...formData, images : reader.result });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  useEffect(() => {
    const getAddress = async () => {
      setCenter({ lat: formData.latitude, lng: formData.longitude });

      console.log("formData.latitude:", formData.latitude);
      console.log("formData.longitude:", formData.longitude);

      try {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          formData.latitude
        },${
          formData.longitude
        }&key=${-Your-Google-Maps-API-Key-}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.status === "OK" && data.results.length > 0) {
          const result = data.results[0];
          setFormData({
            ...formData,
            address: result.formatted_address,
            city: getAddressComponent(result.address_components, "locality"),
            state: getAddressComponent(
              result.address_components,
              "administrative_area_level_1"
            ),
            pincode: getAddressComponent(
              result.address_components,
              "postal_code"
            ),
            country: getAddressComponent(result.address_components, "country"),
          });
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    };

    getAddress();
  }, [formData.latitude, formData.longitude]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    console.log("formData:", formData);

    // Check if all elements are filled
    if (
      !formData.heluhelu ||
      !formData.propertyName ||
      !formData.city ||
      !formData.saleCost ||
      !formData.state ||
      !formData.country ||
      !formData.pincode ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError("Please fill all the fields");
      return;
    }

    try {
      console.log("userSession:", userSession);
      const ownerData = await getDoc(doc(db, "owners", userSession));
      const owners = ownerData.data();
      console.log({ owners });

      // Check if owners and houses are defined
      const sell = owners && owners.sell ? owners.sell : [];

      console.log({ sell });

      const houseid = owners._id + formData.heluhelu;

      // Check if house already exists
      if (sell.some((house) => house === houseid)) {
        setError("Course already exists");
        console.log("already exists");
        return;
      }

      // Update houses array
      sell.push(houseid);
      console.log("pushed : ", sell);

      // Update houses array in owners collection
      await updateDoc(doc(db, "owners", owners._id), {
        sell,
      });

      console.log("works");

      // const cursaleDate = new Date();

      // const options = {
      //   weekday: 'long',
      //   day: 'numeric',
      //   month: 'short',
      //   year: 'numeric',
      //   hour: 'numeric',
      //   minute: 'numeric',
      //   hour12: true,
      // };

      // const formattedDate = cursaleDate.toLocaleString('en-US', options);

      console.log("House Id : ", houseid);

      // const mess ="Welcome to the house. Say Hi to your owner " + owners.name;

      // const houseid = owners._id + formData.heluhelu;

      // Update houses collection
      // const imagesArray = [];
      // try {
      //   // Iterate through each selected image
      //   const files = e.target.files;

      //   for (const image of files) {
      //     const imgRef = ref(imageDb, `sale/${houseid}/image-${imagesArray.length}`);
      //     const uploadTask = uploadBytesResumable(imgRef, image);
      //     await uploadTask.on('state_changed',
      //         (snapshot) => {
      //           // Observe state change events such as progress, pause, and resume
      //           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //           console.log('Upload is ' + progress + '% complete');
      //           switch (snapshot.state) {
      //             case 'paused':
      //               console.log('Upload is paused');
      //               break;
      //             case 'running':
      //               console.log('Upload is in progress');
      //               break;
      //           }
      //         },
      //         (error) => {
      //           // Handle unsuccessful uploads
      //           console.error('Error uploading image:', error);
      //         },
      //         async () => {
      //           // Get download URL after successful upload
      //           const url = await getDownloadURL(uploadTask.snapshot.ref);
      //           imagesArray.push(url);
      //           console.log('Image uploaded successfully:', url);
      //         }
      //     );
      //   }
      // } catch (error) {
      //   console.error('Error uploading images:', error);
      // }
      // const imgRef = ref(storage, `owner/${userSession}/sale/${houseid}`);
      // uploadBytes(imgRef, img).then(async (snapshot) => {
      //   console.log("Uploaded a blob or file!");
      //   const downloadURL = await getDownloadURL(snapshot.ref);
      //   console.log("File available at", downloadURL);
      // });
      const res = await setDoc(doc(db, "rentals", houseid), {
        ownerName: owners.name,
        ownerId: owners._id,
        _id: houseid,
        heluhelu: formData.heluhelu,
        propertyName: formData.propertyName,
        longitude: formData.longitude,
        latitude: formData.latitude,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        pincode: formData.pincode,
        images : formData.images,
      });

      console.log("works");
      setFormData({
        heluhelu: "",
        propertyName: "",
        location: "",
        saleCost: "",
      });

      alert("Course Registered Successfully");

      Navigate("/owner");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="px-4 py-2 flex flex-col md:gap-4">
      <div className="flex items-center justify-between px-3">
        <div className="text-3xl text-black font-['Merriweather'] font-semibold  ">
          Add a New Rental:
        </div>
        {/* <Link href={`/owner/${owner.uid}`}></Link> */}
        <div></div>
      </div>
      <div className="w-content h-fit mx-auto  bg-secondary rounded-md px-6 py-4">
        <div className="flex justify-between gap-20 ">
          <form
            name="fillform"
            className="flex flex-col gap-2 "
            onSubmit={handleSubmit}
          >
            <div className="">
              <label
                htmlFor="heluhelu"
                className="block text-black text-sm font-medium mb-2"
              >
                Heluhelu
              </label>
              <input
                type="text"
                id="heluhelu"
                name="heluhelu"
                value={formData.heluhelu}
                onChange={handleChange}
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                placeholder="Enter the house name"
              />
            </div>

            <div className="">
              <label
                htmlFor="propertyName"
                className="block text-black text-sm font-medium mb-2"
              >
                Property name
              </label>
              <input
                type="text"
                id="propertyName"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleChange}
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                placeholder="Enter student constraints"
              />
            </div>
            <div>
              <div className="">
                <label
                  htmlFor="saleCost"
                  className="block text-black text-sm font-medium mb-2"
                >
                  RentCost
                </label>
                <input
                  type="text"
                  id="saleCost"
                  name="saleCost"
                  value={formData.saleCost}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                  placeholder="Enter the saleCost"
                />
              </div>
            </div>

            <div className="">
              <label className="block text-black text-sm font-medium mb-2">
                Address:
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                autoComplete="address"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                placeholder="Enter student address"
              />
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">
                City:
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                autoComplete="city"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">
                State:
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                autoComplete="state"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Pincode:
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                autoComplete="pincode"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Country:
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                autoComplete="country"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                placeholder=""
              />
            </div>
            <div>
              <label className="block text-black text-sm font-medium mb-2">
                Images :
              </label>
              <input
                accept="image/*"
                type="file"
                name="images"
                onChange={picChange}
                autoComplete="country"
                className="w-96 px-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                placeholder=""
              />
            </div>
            <label>
              {/* Location:
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                autoComplete="latitude"
              />
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                autoComplete="longitude"
              /> */}
            </label>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 w-36 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none "
              >
                Register
              </button>
              <button
                className="bg-blue-500 w-36 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none "
                type="button"
                onClick={handleGetLocation}
              >
                Present Location
              </button>
            </div>
          </form>
          <div className="h-100vh w-full md:flex justify-start items-center flex-col  xl:gap-9">
            <LoadScript
              googleMapsApiKey={-Your-Google-Maps-API-Key-}
              libraries={libraries}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                onClick={handleMapClick}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
                <Autocomplete
                  onLoad={(autoComplete) => setAutoComplete(autoComplete)}
                  onPlaceChanged={() =>
                    handlePlaceSelect(autoComplete.getPlace())
                  }
                >
                  <input
                    type="text"
                    placeholder="Search for places"
                    style={{
                      boxSizing: `border-box`,
                      border: `1px solid transparent`,
                      width: `240px`,
                      height: `32px`,
                      padding: `0 12px`,
                      borderRadius: `3px`,
                      boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                      fontSize: `14px`,
                      outline: `none`,
                      textOverflow: `ellipses`,
                      position: "absolute",
                      left: "50%",
                      marginLeft: "-120px",
                      color: "black",
                    }}
                    onChange={handlePlaceSelect}
                  />
                </Autocomplete>
              </GoogleMap>
            </LoadScript>
            {selectedLocation && (
              <div>
                {/* <p>Selected Location:</p>
                  <p>Latitude: {selectedLocation.lat}</p>
                  <p>Longitude: {selectedLocation.lng}</p> */}
                <button
                  className="bg-blue-500 w-36 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none "
                  onClick={handleLocationSelect}
                >
                  Use this Location
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyForm;
