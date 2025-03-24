import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/restaurants");
                if (!response.ok) throw new Error("Failed to fetch");

                const data = await response.json();
                const foundRestaurant = data.find((rest) => rest._id === id);

                if (!foundRestaurant) {
                    setError("Restaurant not found");
                } else {
                    setRestaurant(foundRestaurant);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;
    if (error) return <div className="text-center text-red-500 text-lg mt-10">Error: {error}</div>;

    return (
        <div className="w-4/6 mx-auto p-6">
            {/* Restaurant Image */}
            <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-80 object-cover rounded-lg shadow-lg" />

            {/* Restaurant Info */}
            <div className="mt-6 flex flex-col space-y-1">
                <div className="flex justify-between">
                    <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                    <p className="text-green-600 text-lg font-semibold">⭐ {restaurant.rating} Rating</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700 text-lg">Cuisines: {restaurant.cuisines.join(", ")}</p>
                    <p className="text-gray-600 text-lg">{restaurant.costForTwoMessage}</p>
                </div>
            </div>

            {/* Menus */}
            <div className="mt-8">
                <MenuSection title="Veg Menu" items={restaurant.vegMenu} />
                <MenuSection title="Non-Veg Menu" items={restaurant.nonVegMenu} />
                <MenuSection title="Drinks" items={restaurant.drinks} />
                <MenuSection title="Speciality" items={restaurant.speciality} />
            </div>
        </div>
    );
};

// ✅ MenuSection Component (Collapsible menu layout)
const MenuSection = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mt-3 border rounded-lg shadow-lg p-1">
            <div 
                className="flex justify-between items-center cursor-pointer bg-gray-100 p-3 rounded-md" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-xl font-semibold">{title}</h2>
                <span className="text-xl">{isOpen ? "▼" : "▶"}</span>
            </div>
            {isOpen && (
                <div className="flex flex-col space-y-4 ">
                    {/* Add New Menu Item Button */}
                    <button className="mt-2 max-w-xl mx-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-500 transition">
                        ➕ Add New Menu/ Dish 
                    </button>
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center border-b pb-4 mx-4">
                            {/* Left - Menu Info */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                                <p className="text-gray-800 font-bold mt-2">₹{item.price}</p>
                                <p className="text-gray-500 text-sm">Serves: {item.servedToPeoples} people</p>
                            </div>

                            {/* Right - Menu Image and Actions */}
                            <div className="flex items-center space-x-4 ">
                                <button className="text-blue-500 hover:text-blue-700">✏️</button>
                                <img src={item.imageUrl} alt={item.name} className="w-36 h-24 object-cover rounded-md" />
                                
                                {/* Edit and Delete Buttons */}
                                <button className="text-red-500 hover:text-red-700">🗑️</button>
                            </div>
                        </div>
                    ))}
                    {/* Total Items Count */}
                    <div className="flex pb-3 justify-between px-5 font-semibold">
                        <span>Total Items:</span>
                        <span>{items.length}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantDetails;