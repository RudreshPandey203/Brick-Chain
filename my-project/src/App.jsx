import React from "react";
import NavBar from "./components/NavBar";
import Landing from "./views/Landing";
import Register from "./views/Register";
import Login from "./views/Login";
import RegisterOwner from "./views/RegisterOwner";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Profile from "./views/profile";
import OwnerHouse from "./views/ownerHouse";
import OwnerRentForm from "./views/OwnerRentForm";
import OwnerSale from "./views/OwnerSaleForm";
import Property from "./views/property";
import PropertyBuy from "./views/PropertyBuy";
const App = () => {
  return (
    <Router>
      <NavBar />
      <div className="pt-[8vh] mx-auto">
      <Routes>
        <Route path="/signUp" element={<Register />} />
      </Routes>
      <Routes>
        <Route path='/signin' element={<Login />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
      <Routes>
        <Route path="/registerOwner" element={<RegisterOwner />} />
      </Routes>
      <Routes>
        <Route path="/profile" element={<Profile/>} />
      </Routes>
      <Routes>
        <Route path="/owner" element={<OwnerHouse/>} />
      </Routes>
      <Routes>
        <Route path="/owners/rentForm" element={<OwnerRentForm />} />
      </Routes>
      <Routes>
        <Route path="/owners/saleForm" element={<OwnerSale/>} />
      </Routes>
      <Routes>
        <Route path="/Rent/:id" element={<Property/>} />
      </Routes>
      <Routes>
        <Route path="/Buy/:id" element={<PropertyBuy/>} />
      </Routes>
      </div>
    </Router>
  );
};

export default App;
