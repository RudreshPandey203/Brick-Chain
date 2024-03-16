import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { set } from "firebase/database";

const rentedProperties = [
  {
    id: 1,
    title: "Spacious Apartment",
    rooms: 3,
    area: "1200 sqft",
    review: 4.5,
    image: "https://dummyimage.com/300x200/000/fff"
  },
  {
    id: 2,
    title: "Cozy House",
    rooms: 2,
    area: "1000 sqft",
    review: 4.2,
    image: "https://dummyimage.com/300x200/000/fff"
  }
];

const saleProperties = [
  {
    id: 1,
    title: "Luxury Villa",
    rooms: 5,
    area: "3000 sqft",
    review: 4.8,
    image: "https://dummyimage.com/300x200/000/fff"
  },
  {
    id: 2,
    title: "Modern Condo",
    rooms: 1,
    area: "800 sqft",
    review: 4.6,
    image: "https://dummyimage.com/300x200/000/fff"
  }
];

function OwnerHouse() {
  const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const user = useAuthState(auth);
  const Navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [rent, setRent] = useState(rentedProperties);
  const [sell, setSell] = useState(saleProperties);

  useEffect(() => {
    if (!userSession) {
      window.location.href = "/signin";
    }
    const fetchData = async () => {
      if (userSession) {
        const docRef = doc(db, "users", userSession);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setRent(docSnap.data().rent);
          setSell(docSnap.data().sell);
        } else {
          console.log("No such document!");
        }
      }
    };
  }, [user, userSession]);

  return (
    <div className="flex flex-col h-[100vh] justify-center ">
      <div>
        <h1>Rented Properties</h1>
        <div className="flex justify-start items-center p-8 overflow-x-auto gap-4">
          {rent.map(property => (
            <div key={property.id} className="border border-gray-300 rounded-md p-4">
              <img src={property.image} alt={property.title} className="w-full h-40 object-cover rounded-md mb-2" />
              <h2 className="text-lg font-semibold">{property.title}</h2>
              <p>Rooms: {property.rooms}</p>
              <p>Area: {property.area}</p>
              <p>Review: {property.review}</p>
            </div>
          ))}
          <Link to="/owners/rentForm" className="bg-blue-600 flex justify-center items-center h-[20vh] w-[20vh] rounded-full hover:bg-blue-400">
            create
          </Link>
        </div>
      </div>
      <div>
        <h1>On Sale</h1>
        <div className="flex justify-start items-center p-8 overflow-x-auto gap-4">
          {sell.map(property => (
            <div key={property.id} className="border border-gray-300 rounded-md p-4">
              <img src={property.image} alt={property.title} className="w-full h-40 object-cover rounded-md mb-2" />
              <h2 className="text-lg font-semibold">{property.title}</h2>
              <p>Rooms: {property.rooms}</p>
              <p>Area: {property.area}</p>
              <p>Review: {property.review}</p>
            </div>
          ))}
          <Link to="/owners/saleForm" className="bg-blue-600 flex justify-center items-center h-[20vh] w-[20vh] rounded-full hover:bg-blue-400">
            create
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OwnerHouse;
