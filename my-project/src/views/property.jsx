import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db, auth } from '../../firebase/config'
import { doc, getDoc, deleteDoc,updateDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { setDoc } from 'firebase/firestore'


function Property() {
    const { id } = useParams()
    const [rentHouse, setRentHouse] = useState({})

    const userSession =
    typeof window !== "undefined" ? sessionStorage.getItem("user") : null;
  const [user] = useAuthState(auth);

    const handleBook = async() => {
        const res = await setDoc(doc(db, "OnRent", id), {
            ...rentHouse,
            ownner : rentHouse.ownerId,
            soldTo : userSession,
            request : 0
        });

        const del = deleteDoc(doc(db,"rentals",id));

        const DocSnap = await getDoc(doc(db,"users",userSession));

        let rentedArray = DocSnap.data().rented;
        rentedArray.push(id)
        console.log(rentedArray);
        const updated = updateDoc(doc(db,"users",userSession),{
            rented : rentedArray
        })


        }

    useEffect(() => {
        // fetch data from firestore
        const fetchData = async () => {
            const docRef = doc(db, "rentals", id);
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

        <button onClick={handleBook} className='bg-blue-600 text-white p-2 rounded-md'>Book Now</button>
    </div>
  )
}

export default Property