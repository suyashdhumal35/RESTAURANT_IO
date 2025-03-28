import React, { } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg'

const Nav = () => {

    const auth = localStorage.getItem("user");
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/signup')
    }

    return (
        <header className="flex items-center justify-between p-4 shadow-md bg-white">
            {/* Left side - Logo */}
            <div>
                <img
                    src={logo}  // Replace with your logo path
                    alt="Logo"
                    className="h-12 object-cover"
                />
            </div>

            {auth ?
                <>
                    {/* Right side - Navigation */}
                    <nav>
                        <ul className="flex gap-6 text-lg font-medium">
                            <li><Link to="/" className="hover:text-blue-500">Products</Link></li>
                            <li><Link to="/add-restaurant" className="hover:text-blue-500">Add Products</Link></li>
                            <li><Link to="/update" className="hover:text-blue-500">Update Products</Link></li>
                            <li><Link to="/profile" className="hover:text-blue-500">Profile</Link></li>
                            <li> <Link onClick={logout} to="/signup" className="hover:text-blue-500">Logout :- {JSON.parse(auth).name || "Guest"                            }</Link> </li>
                        </ul>
                    </nav>
                </>
                :
                <ul className="flex gap-6 text-lg font-medium ml-auto">
                    <li><Link to="/signup" className="hover:text-blue-500">Sign Up</Link></li>
                    <li><Link to="/login" className="hover:text-blue-500">Login</Link></li>
                </ul>

            }
        </header >
    );
};

export default Nav;
