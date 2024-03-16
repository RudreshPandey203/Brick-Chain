import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { set } from "firebase/database";

function OwnerHouse() {
  const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const user = useAuthState(auth);
  const Navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [rent, setRent] = useState([]);
  const [sell, setSell] = useState([]);

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
        <h1>Rent</h1>
        <div className="flex justify-start items-center p-8 overflow-y-scroll h-[30vh]">
          {rent.map((item) => (
            <div>
              <h1>{item}</h1>
            </div>
          ))}
          <Link to="/owners/rentForm" className="bg-blue-600 flex justify-center items-center h-[20vh] w-[20vh] rounded-full hover:bg-blue-400">
            create
          </Link>
        </div>
      </div>
      <div>
        <h1>Buy</h1>
        <div className="flex overflow-y-scroll h-[30vh]">
          {sell.map((item) => (
            <div>
              <h1>{item}</h1>
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
