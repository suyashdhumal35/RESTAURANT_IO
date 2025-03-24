    const express = require('express');
    const cors = require('cors');
    const mongoose = require('mongoose');
    require("./db/config"); // Database connection
    const User = require('./db/Users');
    const Restaurant = require('./db/restaurantSchema');


    const app = express();
    app.use(express.json());
    app.use(cors());


    // ✅ Add Restaurant
    app.post("/add-restaurant", async (req, res) => {
        try {
            const restaurant = new Restaurant(req.body);
            const result = await restaurant.save();
            res.status(201).json(result);
        } catch (error) {
            console.error("Add Restaurant Error:", error);
            res.status(500).json({ error: "Error adding restaurant" });
        }
    });

    // ✅ Get All Restaurants
    // ✅ Fetch all restaurants (From Restaurant Collection)
    app.get("/restaurants", async (req, res) => {
        try {
            const restaurants = await Restaurant.find();
            if (restaurants.length === 0) {
                return res.status(404).json({ message: "No Restaurants Found" });
            }
            res.json(restaurants);
        } catch (error) {
            res.status(500).json({ error: "Error fetching restaurants" });
        }
    });

    // ✅ Get Restaurant by ID


    // ✅ Add a new restaurant (POST request)
    app.post("/add-restaurant", async (req, res) => {
        try {
            // Fetch the last added restaurant to determine the next ID
            const lastRestaurant = await Restaurant.findOne().sort({ id: -1 });

            // Calculate the next ID (convert to string for consistency)
            const newId = lastRestaurant ? (parseInt(lastRestaurant.id) + 1).toString() : "1";

            // Ensure req.body.id is not used directly (MongoDB handles it)
            const newRestaurant = new Restaurant({
                ...req.body,
                id: newId, // Assign the generated ID
            });

            const savedRestaurant = await newRestaurant.save();
            res.status(201).json({ message: "Restaurant added successfully", restaurant: savedRestaurant });
        } catch (error) {
            res.status(500).json({ error: "Error adding restaurant", details: error.message });
        }
    });



    // ✅ Start Server
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}/`));
