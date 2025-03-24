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

    // Cloudinary credentials (replace with your actual values)
    const cloudinaryUploadUrl = "https://api.cloudinary.com/v1_1/dgnxnsl0p/image/upload"; // Replace 'your-cloud-name' with your Cloudinary cloud name
    const cloudinaryUploadPreset = "suyash"; // Replace with your Cloudinary upload preset

    // Handle Image Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryUploadPreset);

        setLoading(true);
        setMessage("");

        try {
            // Upload to Cloudinary
            const response = await fetch(cloudinaryUploadUrl, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                // Log the uploaded image URL to the console
                console.log("Uploaded Image URL:", data.secure_url);
                // Set the imageUrl state with the Cloudinary URL
                setRestaurant((prev) => ({ ...prev, imageUrl: data.secure_url }));
            } else {
                setMessage("Failed to upload image.");
            }
        } catch (error) {
            setMessage("Error uploading image.");
            console.error("Image Upload Error:", error);
        } finally {
            setLoading(false);
        }
    };

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
                console.log("Submitted Restaurant Data:", restaurant);
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

                {/* Restaurant Name */}
                <input
                    type="text"
                    placeholder="Restaurant Name"
                    value={restaurant.name}
                    onChange={(e) => setRestaurant({ ...restaurant, name: e.target.value })}
                    className="border p-2 w-full mb-3 rounded"
                    required
                />

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

                {/* Image Upload */}
                <div className="mb-3">
                    <input
                        type="file"
                        onChange={handleImageUpload}
                        className="border p-2 w-full rounded"
                        accept="image/*"
                    />
                </div>

                {/* Preview Image */}
                {restaurant.imageUrl && (
                    <div className="mb-3 text-center">
                        <img
                            src={restaurant.imageUrl}
                            alt="Uploaded"
                            className="w-48 mx-auto rounded-md shadow-md"
                        />
                    </div>
                )}

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

                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded w-full mt-4"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default AddRestaurant;
