import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/restaurants");
            if (!response.ok) {
                throw new Error("No Restaurants Found");
            }
            const data = await response.json();
            console.log("Fetched Restaurants Data:", data);
            setRestaurants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (id) => {
        console.log("Clicked Restaurant ID:", id);
        navigate(`/restaurant/${id}`);
    };

    const handleAddRestaurant = () => {
        navigate("/add-restaurant", { state: { restaurants } });
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Restaurant List</h1>

            {loading && <p className="text-blue-500 text-center">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Add Restaurant Button as a Card */}
                <div
                    onClick={handleAddRestaurant}
                    className="border p-4 shadow-lg rounded-md cursor-pointer hover:bg-gray-100 transition duration-300 flex flex-col items-center justify-center"
                >
                    <div
                        className="border shadow-lg rounded-full w-16 h-16 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition duration-300 text-3xl font-bold text-gray-600"
                        style={{ boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.5)" }}
                    >
                        +
                    </div>
                    <p className="mt-2 text-gray-700">Add Restaurant</p>
                </div>

                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant._id}
                        onClick={() => handleCardClick(restaurant._id)}
                        className="border p-4 shadow-lg rounded-md cursor-pointer hover:bg-gray-100 transition duration-300"
                    >
                        {/* Image Container with Relative Position */}
                        <div className="relative">
                            {/* ⭐ Star for promoted restaurants */}
                            {restaurant.promotion && (
                                <span className="absolute top-2 left-2 text-yellow-500 text-2xl">⭐</span>
                            )}

                            {/* Restaurant Image */}
                            <img
                                src={restaurant?.imageUrl}
                                alt={restaurant.name}
                                className="w-full h-48 object-cover rounded-md mb-4"
                            />
                        </div>

                        {/* Name and Rating */}
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold">{restaurant?.name}</h2>
                            <span className="text-gray-700 font-bold"> {restaurant?.rating || "N/A"}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-2">{restaurant?.description}</p>

                        {/* Cuisines and Price */}
                        <div className="flex justify-between text-gray-700 mb-2">
                            <p>{restaurant?.cuisines ? restaurant.cuisines.join(", ") : "Unknown"}</p>
                            <p className="font-bold">₹{restaurant?.costForTwoMessage}</p>
                        </div>

                        {/* Delivery Time */}
                        <div className="flex justify-between text-gray-700 mb-2">
                            <p>{restaurant?.deliveryTime}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
