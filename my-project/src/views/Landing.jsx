import React, { useState, useEffect } from "react";
import bg from "../assets/bg.png";
import rect from "../assets/rect.png";
import { Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import { set } from "firebase/database";

const mapContainerStyle = {
  width: "37vw",
  height: "80vh",
};

const libraries = ["places"];
const Landing = () => {
  var sectionStyle = {
    width: "100%",
    height: "350px",
    backgroundImage: `url(${bg})`,
  };

  const [searchTerm, setSearchTerm] = useState("");
  const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const [user] = useAuthState(auth);

  //   console.log("user session : ", userSession);
  //   console.log("user : ", user);
  const [userData, setUserData] = useState({});
  const [rent, setRent] = useState([]);
  const [buy, setBuy] = useState([]);
  const [preferSearch, setPreferSearch] = useState([]);
  const [rsOptions, setRsOptions] = useState(false);
  const [showData, setShowData] = useState([]);
  const [distance, setDistance] = useState(0);
  const [searchNull, setSearchNull] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Buy");

  const NearMeButton = (showData) => {
    if (distance != 0) {
      const preferSearch1 = [];

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          showData.forEach((location) => {
            const lat = location.lat;
            const lng = location.lng;

            const distance = calculateDistance(userLat, userLng, lat, lng);

            if (distance <= distance) {
              preferSearch1.push(location);
            }
          });

          // Now preferSearch contains locations within 40km
          setPreferSearch(preferSearch);
          console.log(preferSearch1);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }
  };

  // Function to calculate distance between two points using Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const picChange = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      setFormData({ ...formData, [e.target.name]: reader.result });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const SearchSort = (e) => {
    const searchTerm = e.target.value.toLowerCase(); // Convert search term to lowercase
    if (searchTerm == "") {
      setSearchNull(!searchNull);
    } else {
      console.log(searchTerm);
      setSearchTerm(searchTerm);

      const filteredRent = showData.filter((item) =>
        item.city.toLowerCase().includes(searchTerm)
      );
      setPreferSearch(filteredRent);
    }
  };

  useEffect(() => {
    if (!userSession) {
      window.location.href = "/signin";
    }
    const fetchData = async () => {
      console.log("HERE WE GO ");
      console.log("user session line 76 : ", userSession);
      const docRef = doc(db, "users", userSession);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
        console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
      console.log("user data : ", userData);
      const rentRef = collection(db, "rentals");
      const rentSnap = await getDocs(rentRef);
      console.log("Number of rental documents: ", rentSnap.docs.length);
      // Iterate over each document in rentSnap
      const rentData = rentSnap.docs.map((doc) => doc.data());
      console.log("Rent Data: ", rentData);
      // Filter out documents where ownerId is not equal to userSession
      const filteredRent = rentData.filter(
        (item) => item.ownerId !== userSession
      );
      // Now, you can set the filteredRent to your state
      setRent(filteredRent);
      console.log("Rent ", rent);
      // Fetching and filtering "sale" collection data
      const sellRef = collection(db, "Sale");
      const sellSnap = await getDocs(sellRef);
      console.log("Number of sale documents: ", sellSnap.docs.length);

      // Iterate over each document in sellSnap
      const sellData = sellSnap.docs.map((doc) => doc.data());

      console.log("Sale Data: ", sellData);

      // Filter out documents where ownerId is not equal to userSession
      const filteredBuy = sellData.filter(
        (item) => item.ownerId !== userSession
      );

      // Now, you can set the filteredBuy to your state
      setBuy(filteredBuy);
      console.log(buy);

      if (selectedOption == "Buy") {
        console.log(selectedOption);
        setShowData(buy);
        setRsOptions(false);
        console.log("showData : ", showData);
      } else {
        console.log(selectedOption);
        setShowData(rent);
        setRsOptions(true);
        console.log("rent = ", rent);
        console.log("showData : ", showData);
      }
      setSearchNull(!searchNull);
    };

    fetchData();
  }, [user, userSession, rsOptions, selectedOption]);

  useEffect(() => {
    const city = userData.city;
    console.log("city : ", city);
    console.log("city name : ", city);
    setPreferSearch(showData.filter((item) => item.city === city));
    console.log("Prefer Search : ", preferSearch);
  }, [searchNull]);

  return (
    <>
      <section
        style={sectionStyle}
        className="flex  justify-center items-center px-48 pt-20"
      >
        <div className="mx-auto w-[80vw] px-8 h-12 bg-white/50 backdrop-blur-sm rounded-full flex justify-evenly items-center gap-4">
          <div className="w-2/3 flex justify-between items-center">
            <div>
              <input
                type="text"
                placeholder="Search for your dream home"
                onChange={SearchSort}
                className="bg-white/0 h-8 placeholder:text-black w-[30rem] placeholder:font-semibold"
              />
            </div>
            <button
              className="bg-red text-white rounded-lg px-3 py-1 flex  items-center gap-2 w-fit"
              onClick={NearMeButton}
            >
              <div>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2143_18)">
                    <path
                      d="M8.5 3.54167C5.76159 3.54167 3.54167 5.76159 3.54167 8.5C3.54167 11.2384 5.76159 13.4583 8.5 13.4583C11.2384 13.4583 13.4583 11.2384 13.4583 8.5C13.4583 5.76159 11.2384 3.54167 8.5 3.54167ZM8.5 3.54167V1.41667M13.8125 8.85417H15.9375M8.5 16.2917V14.1667M1.0625 8.85417H3.1875M8.2342 8.23434H8.76545M8.2342 8.76559H8.76545M9.20833 8.5C9.20833 8.89121 8.8912 9.20834 8.5 9.20834C8.1088 9.20834 7.79167 8.89121 7.79167 8.5C7.79167 8.1088 8.1088 7.79167 8.5 7.79167C8.8912 7.79167 9.20833 8.1088 9.20833 8.5Z"
                      stroke="#F6FBF9"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2143_18">
                      <rect width="17" height="17" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="text-black">Near Me</div>
            </button>
          </div>
          <div className="font-semibold flex border-x-[1px] border-x-black h-full items-center px-6">
            <div>
              <select
                id="options"
                className="bg-transparent"
                value={selectedOption}
                onChange={handleSelectChange}
              >
                <option  value="Buy">Buy</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
          </div>
          <div className="flex font-semibold flex-row">
            <p className="px-2">Distance{" "}</p>
            <div className="">
              <input
              className="bg-transparent outline"
                type="number"
                onChange={(e) => {
                  setDistance(e.target.value);
                }}
              ></input>
            </div>
          </div>
        </div>
      </section>
      <div className="pt-4 px-4 pb-1">
        <button className="bg-red text-white py-2 px-3 rounded-xl">
          BASED ON YOUR SEARCHES
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
  {preferSearch.map((item, index) => (
    <Link
      to={`/${selectedOption}/${item._id}`}
      key={index}
      className="relative bg-white rounded-xl overflow-hidden shadow-lg"
    >
      <img
        src={item.images} // Fetch the image URL dynamically
        alt=""
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{item.propertyName}</h2>
        <div className="flex items-center text-gray-600 text-sm">
          <svg
            className="w-4 h-4 mr-1 text-gray-800"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 20a9.997 9.997 0 0 0 7.071-2.929c3.899-3.898 3.899-10.243 0-14.143A9.997 9.997 0 0 0 10 0a9.997 9.997 0 0 0-7.071 2.929c-3.899 3.899-3.899 10.244 0 14.143A9.997 9.997 0 0 0 10 20zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8z"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 18a7.999 7.999 0 0 0 5.657-2.343c3.124-3.124 3.124-8.189 0-11.313A7.999 7.999 0 0 0 10 0a7.999 7.999 0 0 0-5.657 2.343c-3.124 3.124-3.124 8.189 0 11.313A7.999 7.999 0 0 0 10 18zM10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z"
            />
          </svg>
          <span>{item.address}</span>
        </div>
      </div>
    </Link>
  ))}
</div>

    </>
  );
};

export default Landing;
