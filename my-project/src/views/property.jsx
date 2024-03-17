import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db, auth } from '../../firebase/config';
import { doc, getDoc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

function Property() {
    const { id } = useParams();
    const [rentHouse, setRentHouse] = useState({});
    const [user] = useAuthState(auth);

    const handleBook = async () => {
        const res = await setDoc(doc(db, "OnRent", id), {
            ...rentHouse,
            ownner: rentHouse.ownerId,
            soldTo: user.uid,
            request: 0
        });

        const del = deleteDoc(doc(db, "rentals", id));

        const docSnap = await getDoc(doc(db, "users", user.uid));
        let rentedArray = docSnap.data().rented || [];
        rentedArray.push(id);
        const updated = updateDoc(doc(db, "users", user.uid), { rented: rentedArray });
    };

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

    }, [id]);

    return (
        <div className="container mx-auto px-4 py-8">
            {rentHouse && (
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold mb-4">{rentHouse.name}</h1>
                    <img src={rentHouse.images} alt="rent house" className="w-full md:max-w-md h-auto rounded-lg mb-4" />
                    <div className="text-lg">
                        <p>{rentHouse.address},</p>
                        <p>{rentHouse.city}, {rentHouse.state} - {rentHouse.pincode}</p>
                    </div>
                    <div className="mt-4">
                        <p className="text-xl font-bold">Rent: ${rentHouse.rent}/month</p>
                    </div>
                    <button onClick={handleBook} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">Book Now</button>
                </div>
            )}
        </div>
    );
}

export default Property;
