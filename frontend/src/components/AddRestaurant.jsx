import React, { useState, useEffect } from "react";

const AddRestaurant = () => {
    const [restaurant, setRestaurant] = useState({
        id: "",
        name: "",
        cuisines: [],
        costForTwoMessage: "",
        imageUrl: "",
        deliveryTime: "",
        rating: "",
        vegMenu: [],
        nonVegMenu: [],
        drinks: [],
        speciality: [],
        promotion: false
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLastRestaurant = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/restaurants");
                if (!response.ok) throw new Error("Failed to fetch restaurants");

                const data = await response.json();
                if (data.length > 0) {
                    const lastRestaurant = data[data.length - 1];
                    const newId = (parseInt(lastRestaurant.id) + 1).toString();
                    setRestaurant(prev => ({ ...prev, id: newId }));
                } else {
                    setRestaurant(prev => ({ ...prev, id: "1" }));
                }
            } catch (error) {
                console.error("Error fetching last restaurant:", error);
            }
        };

        fetchLastRestaurant();
    }, []);

    const handleCuisineChange = (e) => {
        const cuisinesArray = e.target.value.split(",").map(item => item.trim()).filter(item => item !== "");
        setRestaurant(prev => ({ ...prev, cuisines: cuisinesArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("http://127.0.0.1:5000/add-restaurant", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(restaurant),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("Restaurant added successfully!");
                setRestaurant({
                    id: (parseInt(restaurant.id) + 1).toString(), // Increment ID for next entry
                    name: "",
                    cuisines: [],
                    costForTwoMessage: "",
                    imageUrl: "",
                    deliveryTime: "",
                    rating: "",
                    vegMenu: [],
                    nonVegMenu: [],
                    drinks: [],
                    speciality: [],
                    promotion: false
                });
            } else {
                setMessage(data.error || "Failed to add restaurant");
            }
        } catch (error) {
            setMessage("Error submitting data. Try again!");
            console.error("Submit Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 w-4/6">
            <h1 className="text-3xl font-bold mb-6 text-center">Add New Restaurant</h1>
            {message && <p className={`mb-4 text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md">
                
                {/* ID and Name in One Row */}
                <div className="flex gap-4 mb-3">
                    <input
                        type="text"
                        placeholder="Restaurant ID"
                        value={restaurant.id}
                        readOnly
                        className="border p-2 w-1/4 rounded bg-gray-100"
                    />
                    <input
                        type="text"
                        placeholder="Restaurant Name"
                        value={restaurant.name}
                        onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                        className="border p-2 w-3/4 rounded"
                        required
                    />
                </div>

                {/* Cuisines and Promotion in One Row */}
                <div className="flex gap-4 mb-3">
                    <input
                        type="text"
                        placeholder="Cuisines (comma-separated)"
                        onChange={handleCuisineChange}
                        className="border p-2 w-3/4 rounded"
                        required
                    />
                    <div className="flex items-center w-1/4">
                        <input
                            type="checkbox"
                            checked={restaurant.promotion}
                            onChange={(e) => setRestaurant({ ...restaurant, promotion: e.target.checked })}
                            className="mr-2"
                        />
                        <span>Promotion</span>
                    </div>
                </div>

                {/* Image URL */}
                <input
                    type="text"
                    placeholder="Image URL"
                    value={restaurant.imageUrl}
                    onChange={(e) => setRestaurant({ ...restaurant, imageUrl: e.target.value })}
                    className="border p-2 w-full mb-3 rounded"
                    required
                />

                {/* Cost, Delivery Time, Rating in One Row */}
                <div className="flex gap-4 mb-3">
                    <input
                        type="text"
                        placeholder="Price"
                        value={restaurant.costForTwoMessage}
                        onChange={(e) => setRestaurant({ ...restaurant, costForTwoMessage: e.target.value })}
                        className="border p-2 w-1/3 rounded"
                        required
                    />
                    <input
                        type="number"
                        min="0"
                        placeholder="Time (in minutes)"
                        className="border p-2 w-1/3 rounded"
                        value={restaurant.deliveryTime}
                        onChange={(e) => setRestaurant({ ...restaurant, deliveryTime: e.target.value })}
                    />
                    <div className="w-1/3 flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.5"
                            value={restaurant.rating}
                            onChange={(e) => setRestaurant({ ...restaurant, rating: e.target.value })}
                            className="border p-2 w-full rounded"
                        />
                        <span className="ml-2">{restaurant.rating}</span>
                    </div>
                </div>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full mt-4" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default AddRestaurant;
