import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"


const UpdateProduct = () => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [company, setCompany] = useState("");
    const navigate = useNavigate()

    const params = useParams();
    useEffect(() => {
        getProductDetails()
    }, [])

    const getProductDetails = async () => {
        console.warn(params);
        let result = await fetch(`http://localhost:5000/product/${params.id}`)
        result = await result.json()
        setName(result.name)
        setPrice(result.price)
        setCategory(result.category)
        setCompany(result.company)
    }

    const updateProduct = async () => {
        console.warn(name, price, category, company);
        let result = await fetch(`http://localhost:5000/product/${params.id}`, {
            method: "Put",
            body: JSON.stringify({ name, price, company, category }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        result = await result.json()
        console.warn(result);
        navigate("/")
    }


    return (
        <div className="max-w-2xl w-full mx-auto p-6 border rounded-lg shadow-lg bg-white mt-10">
            <h2 className="text-2xl font-semibold text-center mb-4">Update Product</h2>

            <div className="w-full sm:w-4/5 mx-auto mb-3">
                <input
                    type="text"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="w-full sm:w-4/5 mx-auto mb-3">
                <input
                    type="text"
                    placeholder="Enter product price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    onBlur={() => handleBlur("price")}
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="w-full sm:w-4/5 mx-auto mb-3">
                <input
                    type="text"
                    placeholder="Enter product category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    onBlur={() => handleBlur("category")}
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="w-full sm:w-4/5 mx-auto mb-4">
                <input
                    type="text"
                    placeholder="Enter product company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    onBlur={() => handleBlur("company")}
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <button
                onClick={updateProduct}
                className="w-full sm:w-4/5 mx-auto bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition block">
                Update Product
            </button>
        </div>
    );
};

export default UpdateProduct;