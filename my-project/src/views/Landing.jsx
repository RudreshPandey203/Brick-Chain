import React, {useState, useEffect} from "react";
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

  const [searchTerm , setSearchTerm] = useState('');
  const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [rent, setRent] = useState([]);
  const [buy, setBuy] = useState([]);
  const [preferSearch, setPreferSearch] = useState([]);
  const [rsOptions, setRsOptions] = useState(false);

  useEffect(() => {
	if (!userSession) {
	  window.location.href = "/signin";
	}
	const fetchData = async () => {
	  if (userSession) {
		console.log("HERE WE GO ")
		const docRef = doc(db, "users", userSession);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
		  setUserData(docSnap.data());
		  console.log("Document data:", docSnap.data()); 
		} else {
		  console.log("No such document!");
		}
		const rentRef = collection(db, "rentals");
		const rentSnap = await getDocs(rentRef);
		setRent(rentSnap.docs.map((doc) => doc.data()));
		console.log("Rent " , rent);
		const sellRef = collection(db, "sale");
		const sellSnap = await getDocs(sellRef);
		setBuy(sellSnap.docs.map((doc) => doc.data()));
		console.log("Buy " , buy);

		const city = userData.city;
		if(!rsOptions){
			console.log("city name : ",city)
			setPreferSearch(rent.filter(item => item.city === city)); 
		}
		console.log(preferSearch);
	  }
	};

	fetchData();
  },[user, userSession]);

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
                placeholder="“Search properties in Gurgaon”"
                className="bg-white/0 placeholder:text-black w-[30rem] placeholder:font-semibold"
              />
            </div>
            <button className="bg-red text-white rounded-lg px-3 py-1 flex  items-center gap-2 w-fit">
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
              <div className="">Near Me</div>
            </button>
          </div>
          <div className="font-semibold flex border-x-[1px] border-x-black h-full items-center px-6">
            Budget{" "}
            <div className="">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 10L12.7071 15.2929C12.3166 15.6834 11.6834 15.6834 11.2929 15.2929L6 10"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex font-semibold">
            Distance{" "}
            <div className="">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 10L12.7071 15.2929C12.3166 15.6834 11.6834 15.6834 11.2929 15.2929L6 10"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>
      <div className="pt-4 px-4 pb-1">
        <button className="bg-red text-white py-2 px-3 rounded-xl">
          BASED ON YOUR SEARCHES
        </button>
      </div>
      {/* <div className="p-4 flex w-[80vw] ">
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-[#ECECEC] drop-shadow-lg h-[22rem] rounded-xl w-80 p-2 flex flex-col gap-3">
            <img
              src={rect}
              alt=""
              className="w-80 h-44 object-cover rounded-xl"
            />
            <div className="text-black font-bold">APARTMENT IN AUCKLAND</div>
            <div className="flex items-center font-bold text-sm">
              <svg
                className="pt-1"
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.64703 5.66667C8.64703 6.95533 7.60236 8 6.3137 8C5.02504 8 3.98037 6.95533 3.98037 5.66667C3.98037 4.378 5.02504 3.33333 6.3137 3.33333C7.60236 3.33333 8.64703 4.378 8.64703 5.66667Z"
                  stroke="#111111"
                  stroke-width="2"
                />
                <path
                  d="M10.9804 5.66667C10.9804 8.244 7.48037 12.6667 6.3137 12.6667C5.14703 12.6667 1.64703 8.244 1.64703 5.66667C1.64703 3.08934 3.73637 1 6.3137 1C8.89103 1 10.9804 3.08934 10.9804 5.66667Z"
                  stroke="#111111"
                  stroke-width="2"
                />
              </svg>
              147 , 149 VICTORIA STREET WEST
            </div>
            <div className="flex justify-between w-full border-b-2 border-b-black pb-6">
              <div className="flex justify-between gap-2 w-1/3">
                <div className="flex items-center font-bold gap-1">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.91669 15.3333L4.39351 9.02871C4.65662 8.35896 4.79169 7.64578 4.79169 6.92621V5.75001C4.79169 4.69146 5.64981 3.83334 6.70835 3.83334H16.2917C17.3502 3.83334 18.2084 4.69146 18.2084 5.75001V6.92621C18.2084 7.64578 18.3434 8.35896 18.6065 9.02871L21.0834 15.3333M4.79169 7.66668H7.66669M15.3334 7.66668H18.2084M3.83335 18.2083H19.1667C20.2252 18.2083 21.0834 17.3502 21.0834 16.2917C21.0834 15.2331 20.2252 14.375 19.1667 14.375H3.83335C2.77481 14.375 1.91669 15.2331 1.91669 16.2917C1.91669 17.3502 2.77481 18.2083 3.83335 18.2083ZM9.58335 10.5417H13.4167C14.4752 10.5417 15.3334 9.68356 15.3334 8.62501C15.3334 7.56646 14.4752 6.70834 13.4167 6.70834H9.58335C8.52481 6.70834 7.66669 7.56646 7.66669 8.62501C7.66669 9.68356 8.52481 10.5417 9.58335 10.5417Z"
                      stroke="#111111"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                  2
                </div>
                <div className="flex items-center font-bold gap-1">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.87499 13.4167H20.125M17.25 9.58334V5.27084C17.25 4.47693 16.6064 3.83334 15.8125 3.83334C15.0186 3.83334 14.375 4.47693 14.375 5.27084V5.75001M4.79166 17.25L3.83332 19.1667M18.2083 17.25L19.1667 19.1667M8.81666 18.2083H14.1833C17.9941 18.2083 21.0833 15.1191 21.0833 11.3083C21.0833 10.3557 20.311 9.58334 19.3583 9.58334H3.64166C2.68897 9.58334 1.91666 10.3557 1.91666 11.3083C1.91666 15.1191 5.00589 18.2083 8.81666 18.2083Z"
                      stroke="#111111"
                      stroke-width="2"
                      stroke-linecap="round"
                    />
                  </svg>
                  2
                </div>
                <div className="flex items-center font-bold gap-1">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.25 10.5417H19.1667C20.2252 10.5417 21.0833 11.3998 21.0833 12.4583V13.4167C21.0833 14.4752 20.2252 15.3333 19.1667 15.3333M17.25 10.5417L15.7702 6.10222C15.5093 5.31956 14.7769 4.79166 13.9519 4.79166H9.58332M17.25 10.5417H9.58332M3.83332 10.5417L5.31314 6.10222C5.57402 5.31956 6.30645 4.79166 7.13144 4.79166H9.58332M3.83332 10.5417H9.58332M3.83332 10.5417C2.77478 10.5417 1.91666 11.3998 1.91666 12.4583V13.4167C1.91666 14.4752 2.77478 15.3333 3.83332 15.3333M9.58332 10.5417V4.79166M7.66666 15.3333H15.3333M7.66666 15.3333C7.66666 16.3919 6.80854 17.25 5.74999 17.25C4.69144 17.25 3.83332 16.3919 3.83332 15.3333M7.66666 15.3333C7.66666 14.2748 6.80854 13.4167 5.74999 13.4167C4.69144 13.4167 3.83332 14.2748 3.83332 15.3333M15.3333 15.3333C15.3333 16.3919 16.1914 17.25 17.25 17.25C18.3085 17.25 19.1667 16.3919 19.1667 15.3333M15.3333 15.3333C15.3333 14.2748 16.1914 13.4167 17.25 13.4167C18.3085 13.4167 19.1667 14.2748 19.1667 15.3333"
                      stroke="#111111"
                      stroke-width="2"
                    />
                  </svg>
                  1
                </div>
              </div>
              <div className="flex items-center font-bold gap-1">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5039 17.9042L12.2726 17.2646L11.5039 16.3408L10.7353 17.2646L11.5039 17.9042ZM16.0111 18.3923L15.3511 17.641L16.0111 18.3923ZM16.5231 13.5156L15.7254 14.1186L16.5231 13.5156ZM6.4848 13.5156L7.28251 14.1186L7.28251 14.1186L6.4848 13.5156ZM6.99684 18.3923L6.34724 19.1526L6.99684 18.3923ZM13.234 10.3536L12.8729 11.2861L13.234 10.3536ZM9.77391 10.3536L10.135 11.2861H10.135L9.77391 10.3536ZM4.43207 8.22389C3.87978 8.22389 3.43207 8.6716 3.43207 9.22389C3.43207 9.77617 3.87978 10.2239 4.43207 10.2239V8.22389ZM5.15082 10.2239C5.7031 10.2239 6.15082 9.77617 6.15082 9.22389C6.15082 8.6716 5.7031 8.22389 5.15082 8.22389V10.2239ZM4.43207 8.94264C3.87978 8.94264 3.43207 9.39035 3.43207 9.94264C3.43207 10.4949 3.87978 10.9426 4.43207 10.9426V8.94264ZM5.15082 10.9426C5.7031 10.9426 6.15082 10.4949 6.15082 9.94264C6.15082 9.39035 5.7031 8.94264 5.15082 8.94264V10.9426ZM8.2654 5.34889C7.71312 5.34889 7.2654 5.7966 7.2654 6.34889C7.2654 6.90117 7.71312 7.34889 8.2654 7.34889V5.34889ZM8.98415 7.34889C9.53644 7.34889 9.98415 6.90117 9.98415 6.34889C9.98415 5.7966 9.53644 5.34889 8.98415 5.34889V7.34889ZM8.2654 6.06764C7.71312 6.06764 7.2654 6.51535 7.2654 7.06764C7.2654 7.61992 7.71312 8.06764 8.2654 8.06764V6.06764ZM8.98415 8.06764C9.53644 8.06764 9.98415 7.61992 9.98415 7.06764C9.98415 6.51535 9.53644 6.06764 8.98415 6.06764V8.06764ZM13.0571 4.39056C12.5048 4.39056 12.0571 4.83827 12.0571 5.39056C12.0571 5.94284 12.5048 6.39056 13.0571 6.39056V4.39056ZM13.7758 6.39056C14.3281 6.39056 14.7758 5.94284 14.7758 5.39056C14.7758 4.83827 14.3281 4.39056 13.7758 4.39056V6.39056ZM13.0571 5.10931C12.5048 5.10931 12.0571 5.55702 12.0571 6.10931C12.0571 6.66159 12.5048 7.10931 13.0571 7.10931V5.10931ZM13.7758 7.10931C14.3281 7.10931 14.7758 6.66159 14.7758 6.10931C14.7758 5.55702 14.3281 5.10931 13.7758 5.10931V7.10931ZM17.8487 8.22389C17.2964 8.22389 16.8487 8.6716 16.8487 9.22389C16.8487 9.77617 17.2964 10.2239 17.8487 10.2239V8.22389ZM18.5675 10.2239C19.1198 10.2239 19.5675 9.77617 19.5675 9.22389C19.5675 8.6716 19.1198 8.22389 18.5675 8.22389V10.2239ZM17.8487 8.94264C17.2964 8.94264 16.8487 9.39035 16.8487 9.94264C16.8487 10.4949 17.2964 10.9426 17.8487 10.9426V8.94264ZM18.5675 10.9426C19.1198 10.9426 19.5675 10.4949 19.5675 9.94264C19.5675 9.39035 19.1198 8.94264 18.5675 8.94264V10.9426ZM10.7353 18.5438C12.1758 20.2751 14.7309 20.8477 16.671 19.1436L15.3511 17.641C14.4104 18.4673 13.1313 18.2966 12.2726 17.2646L10.7353 18.5438ZM16.671 19.1436C18.5043 17.5334 18.7684 14.8274 17.3208 12.9125L15.7254 14.1186C16.5401 15.1963 16.3986 16.7209 15.3511 17.641L16.671 19.1436ZM5.68709 12.9125C4.248 14.8162 4.46592 17.5452 6.34724 19.1526L7.64643 17.632C6.59742 16.7358 6.45928 15.2076 7.28251 14.1186L5.68709 12.9125ZM6.34724 19.1526C8.3019 20.8227 10.8244 20.2843 12.2726 18.5438L10.7353 17.2646C9.88424 18.2873 8.6221 18.4657 7.64643 17.632L6.34724 19.1526ZM17.3208 12.9125C16.0212 11.1935 15.1813 10.0352 13.595 9.42102L12.8729 11.2861C13.828 11.6559 14.3337 12.2776 15.7254 14.1186L17.3208 12.9125ZM7.28251 14.1186C8.67424 12.2776 9.17992 11.6559 10.135 11.2861L9.41286 9.42102C7.82662 10.0352 6.98665 11.1935 5.68709 12.9125L7.28251 14.1186ZM13.595 9.42102C12.9904 9.18693 12.209 9.09616 11.5039 9.09616C10.7989 9.09616 10.0175 9.18693 9.41286 9.42102L10.135 11.2861C10.4168 11.177 10.9222 11.0962 11.5039 11.0962C12.0857 11.0962 12.5911 11.177 12.8729 11.2861L13.595 9.42102ZM4.75001 9.58332C4.75001 9.56031 4.76866 9.54166 4.79168 9.54166V11.5417C5.87324 11.5417 6.75001 10.6649 6.75001 9.58332H4.75001ZM4.79168 9.54166C4.81469 9.54166 4.83334 9.56031 4.83334 9.58332H2.83334C2.83334 10.6649 3.71012 11.5417 4.79168 11.5417V9.54166ZM4.83334 9.58332C4.83334 9.60634 4.81469 9.62499 4.79168 9.62499V7.62499C3.71012 7.62499 2.83334 8.50176 2.83334 9.58332H4.83334ZM4.79168 9.62499C4.76866 9.62499 4.75001 9.60633 4.75001 9.58332H6.75001C6.75001 8.50177 5.87324 7.62499 4.79168 7.62499V9.62499ZM4.43207 10.2239H5.15082V8.22389H4.43207V10.2239ZM4.43207 10.9426H5.15082V8.94264H4.43207V10.9426ZM8.58334 6.70832C8.58334 6.68531 8.602 6.66666 8.62501 6.66666V8.66666C9.70657 8.66666 10.5833 7.78988 10.5833 6.70832H8.58334ZM8.62501 6.66666C8.64802 6.66666 8.66668 6.68531 8.66668 6.70832H6.66668C6.66668 7.78988 7.54345 8.66666 8.62501 8.66666V6.66666ZM8.66668 6.70832C8.66668 6.73134 8.64802 6.74999 8.62501 6.74999V4.74999C7.54345 4.74999 6.66668 5.62676 6.66668 6.70832H8.66668ZM8.62501 6.74999C8.602 6.74999 8.58334 6.73133 8.58334 6.70832H10.5833C10.5833 5.62677 9.70657 4.74999 8.62501 4.74999V6.74999ZM8.2654 7.34889H8.98415V5.34889H8.2654V7.34889ZM8.2654 8.06764H8.98415V6.06764H8.2654V8.06764ZM13.375 5.74999C13.375 5.72698 13.3937 5.70832 13.4167 5.70832V7.70832C14.4982 7.70832 15.375 6.83155 15.375 5.74999H13.375ZM13.4167 5.70832C13.4397 5.70832 13.4583 5.72698 13.4583 5.74999H11.4583C11.4583 6.83155 12.3351 7.70832 13.4167 7.70832V5.70832ZM13.4583 5.74999C13.4583 5.773 13.4397 5.79166 13.4167 5.79166V3.79166C12.3351 3.79166 11.4583 4.66843 11.4583 5.74999H13.4583ZM13.4167 5.79166C13.3937 5.79166 13.375 5.773 13.375 5.74999H15.375C15.375 4.66843 14.4982 3.79166 13.4167 3.79166V5.79166ZM13.0571 6.39056H13.7758V4.39056H13.0571V6.39056ZM13.0571 7.10931H13.7758V5.10931H13.0571V7.10931ZM18.1667 9.58332C18.1667 9.56031 18.1853 9.54166 18.2083 9.54166V11.5417C19.2899 11.5417 20.1667 10.6649 20.1667 9.58332H18.1667ZM18.2083 9.54166C18.2314 9.54166 18.25 9.56031 18.25 9.58332H16.25C16.25 10.6649 17.1268 11.5417 18.2083 11.5417V9.54166ZM18.25 9.58332C18.25 9.60633 18.2314 9.62499 18.2083 9.62499V7.62499C17.1268 7.62499 16.25 8.50177 16.25 9.58332H18.25ZM18.2083 9.62499C18.1853 9.62499 18.1667 9.60633 18.1667 9.58332H20.1667C20.1667 8.50177 19.2899 7.62499 18.2083 7.62499V9.62499ZM17.8487 10.2239H18.5675V8.22389H17.8487V10.2239ZM17.8487 10.9426H18.5675V8.94264H17.8487V10.9426Z"
                    fill="#111111"
                  />
                </svg>
                PET FRIENDLY
              </div>
            </div>
            <div className="font-bold">₹5000 per month</div>
          </div>
        </div>
      </div> */}
	  <div className="mx-auto p-4 flex w-[80vw] ">
  {preferSearch.map((item, index) => (
    <div key={index} className="bg-[#ECECEC] drop-shadow-lg h-[22rem] rounded-xl w-80 m-4 p-2 flex flex-col gap-3">
      <img
        src={`owners/${item.ownerId}/rent/${item._id}`} // Add your image source here
        alt=""
        className="w-80 h-44 object-cover rounded-xl"
      />
      <div className="text-black font-bold">{item.propertyName}</div>
      <div className="flex items-center font-bold text-sm">
        <svg
          className="pt-1"
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.64703 5.66667C8.64703 6.95533 7.60236 8 6.3137 8C5.02504 8 3.98037 6.95533 3.98037 5.66667C3.98037 4.378 5.02504 3.33333 6.3137 3.33333C7.60236 3.33333 8.64703 4.378 8.64703 5.66667Z"
            stroke="#111111"
            strokeWidth="2"
          />
          <path
            d="M10.9804 5.66667C10.9804 8.244 7.48037 12.6667 6.3137 12.6667C5.14703 12.6667 1.64703 8.244 1.64703 5.66667C1.64703 3.08934 3.73637 1 6.3137 1C8.89103 1 10.9804 3.08934 10.9804 5.66667Z"
            stroke="#111111"
            strokeWidth="2"
          />
        </svg>
        {item.address}
      </div>
    </div>
  ))}
</div>

    </>
  );
};

export default Landing;
