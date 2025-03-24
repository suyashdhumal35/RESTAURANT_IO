import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Move useEffect outside to check authentication when the component loads
    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async () => {
        console.log("Email:", email);
        console.log("Password:", password);

        let result = await fetch("http://localhost:5000/login", {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        result = await result.json();
        console.log("Response:", result);

        if (result.name) {
            localStorage.setItem("user", JSON.stringify(result)); // Store user in localStorage
            navigate("/");
        } else {
            alert("Please enter correct details");
        }
    };

    return (
        <div className='w-96 m-auto p-4 border rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4 text-center'>Login</h2>
            <input
                type="email"
                placeholder='Enter Email...'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full p-2 mb-3 border rounded'
            />
            <input
                type="password"
                placeholder='Enter Password...'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full p-2 mb-3 border rounded'
            />
            <button
                onClick={handleLogin}
                className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
                Login
            </button>
        </div>
    );
};

export default Login;
