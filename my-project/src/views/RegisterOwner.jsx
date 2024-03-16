import React, { useState } from "react";
import { db } from "../../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../../firebase/config";

function RegisterOwner() {
  const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [img, setImg] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if any of the input fields are empty
      if (!formData.name || !formData.email || !formData.companyName || !formData.address) {
        throw new Error("Please fill in all the fields");
      }

      const imgRef = ref(imageDb, `owner/${userSession}/proposal`);
      uploadBytes(imgRef, img).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });

      // Prepare data to be stored in the database
      const userData = {
        _id: userSession,
        name: formData.name,
        email: formData.email,
        request: 0,
        companyName: formData.companyName,
        address: formData.address,
        rent : [],
        sell : [], // Placeholder for file URLs, to be updated after file upload
      };

      // Store user data in Firestore
      await setDoc(doc(db, "owners", userSession), userData);

      // Upload files to the backend
      // const formDataForUpload = new FormData();
      // formData.files.forEach((file) => {
      //   formDataForUpload.append("files", file);
      // });
      // await axios.post("your-backend-upload-files-api-url", formDataForUpload);

      setLoading(true);
      setFormData({
        name: "",
        email: "",
        companyName: "",
        address: "",
        files: [],
      });
      setError("");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="bg-red h-[100vh] flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Register as Owner</h2>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border rounded p-2 mb-4 w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border rounded p-2 mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className="border rounded p-2 mb-4 w-full"
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="border rounded p-2 mb-4 w-full"
        />
        <input
          type="file"
          name="files"    
          onChange={handleFileChange}
          className="border rounded p-2 mb-4 w-full"
        />
        <button
          type="submit"
          className="bg-red text-white p-2 rounded hover:bg-blue-600 transition-all w-full"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Register"}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}

export default RegisterOwner;
