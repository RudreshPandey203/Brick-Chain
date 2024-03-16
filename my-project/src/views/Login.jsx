import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [metaMaskUser, setMetaMaskUser] = useState(null);
  const [metaMaskBalance, setMetaMaskBalance] = useState(null);
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sign in with email and password
      const authUser = await signInWithEmailAndPassword(email, password);
      if (authUser) {
        console.log("Authentication successful");
        sessionStorage.setItem("user", authUser.user.uid);
        await connectMetaMask(); // Connect MetaMask on login
        // Show success message
        setError("Login successful");
        // Redirect to landing page
        Navigate("/");
      } else {
        console.error("Invalid user data");
        setError("Invalid user data");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.message);
    }
  };

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('MetaMask connected');
        const web3 = new Web3(window.ethereum);
        const user = await web3.eth.getAccounts();
        setMetaMaskUser(user[0]);
        const balance = await web3.eth.getBalance(user[0]);
        setMetaMaskBalance(web3.utils.fromWei(balance, 'ether'));
      } catch (error) {
        console.error('MetaMask connection failed:', error);
        throw error; // Propagate error to handle it in handleSubmit
      }
    } else {
      console.error('MetaMask not found');
      throw new Error('MetaMask not found');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-blue-200 to-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md w-96" style={{ borderRadius: "20px" }}>
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter your email"
          />

          <label className="text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter your password"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all"
          >
            Login
          </button>

          <div className="text-red-500">{error}</div>
          {metaMaskUser && (
            <div>
              <p>MetaMask User: {metaMaskUser}</p>
              <p>MetaMask Balance: {metaMaskBalance} ETH</p>
            </div>
          )}
        </form>
        <div className="mt-4">
          Don't have an account?{" "}
          <Link to="/signUp" className="text-blue-500">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;