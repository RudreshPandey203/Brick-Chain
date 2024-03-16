import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db, auth } from '../../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'


function PropertyBuy() {
    const { id } = useParams()
    const [rentHouse, setRentHouse] = useState({})
    const userSession = typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
    const user = useAuthState(auth);

    useEffect(() => {
        // fetch data from firestore
        const fetchData = async () => {
            const docRef = doc(db, "Sale", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Property ka data h Document data:", docSnap.data());
                setRentHouse(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchData();
        
    },[id])
  return (
    
    <div>
        {rentHouse && (
            <div>
                <h1>{rentHouse.name}</h1>
                <h1>{rentHouse.address}</h1>
                <h1>{rentHouse.city}</h1>
                <h1>{rentHouse.state}</h1>
                <h1>{rentHouse.pincode}</h1>
                <h1>{rentHouse.rent}</h1>
                <img src={rentHouse.images} alt="rent house" />
            </div>
        )}
    </div>
  )
}

export default PropertyBuy