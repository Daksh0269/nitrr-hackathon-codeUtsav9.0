import React, { useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom"; // Added NavLink for styling active links
import Button from "../components/Button";
import LogoutButton from "../components/LogoutButton";
import { useSelector } from "react-redux";

// Hamburger Icon Component
const MenuIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
);

// Close Icon Component (for mobile menu)
const CloseIcon = () => (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);


const Navbar = () => {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);
    // State to manage the mobile menu's open/close status
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { name: 'Home', slug: '/' },
        { name: 'Clubs', slug: '/clubs' },
        { name: 'Courses', slug: '/course' },
        { name: 'Blog', slug: '/Blog' },
    ];

    return (
        // 1. Container: Black background, sticky, with a subtle gray border bottom
        <nav className="bg-black text-white sticky top-0 z-50 border-b border-[#333333]">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                
                {/* Logo / Brand Name */}
                <Link 
                    to="/" 
                    className="text-2xl font-bold tracking-wider text-white hover:text-blue-500 transition-colors duration-200"
                >
                    MyApp
                </Link>

                {/* 2. Desktop Navigation Links (Hidden on small screens) */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map(item => (
                        <NavLink 
                            key={item.slug}
                            to={item.slug} 
                            // Use NavLink's isActive to apply blue accent to the current page
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors duration-200
                                ${isActive 
                                    ? 'text-blue-500' // Active link color
                                    : 'text-gray-300 hover:text-white' // Inactive link color
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* 3. Desktop Action Buttons (Hidden on small screens) */}
                <div className="hidden md:flex items-center space-x-3">
                    
                    {!authStatus && (
                        <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => navigate("/login")}
                            className="font-medium"
                        >
                            Login
                        </Button>
                    )}
                    
                    {authStatus && (
                        <LogoutButton variant="destructive" size="sm" />
                    )}
                </div>

                {/* 4. Hamburger Button (Visible only on small screens) */}
                <div className="md:hidden">
                    <button 
                        onClick={toggleMenu} 
                        className="p-2 rounded-md hover:bg-[#333333] transition-colors duration-200 focus:outline-none"
                    >
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>
            
            {/* 5. Mobile Menu (Toggled by state) */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#181818] border-b border-[#333333] shadow-lg pb-4">
                    <div className="flex flex-col space-y-2 px-4 py-2">
                        {navItems.map(item => (
                            <NavLink
                                key={item.slug}
                                to={item.slug}
                                onClick={toggleMenu} // Close menu on link click
                                className={({ isActive }) =>
                                    `py-2 px-3 rounded-md text-base font-medium transition-colors duration-200 text-left
                                    ${isActive 
                                        ? 'bg-blue-600 text-white' 
                                        : 'text-gray-300 hover:bg-[#333333] hover:text-white'
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                        
                        <hr className="border-[#333333] my-1" />

                        {/* Mobile Auth Buttons */}
                        <div className="flex flex-col space-y-2 pt-2">
                            {!authStatus ? (
                                <Button 
                                    variant="default" 
                                    size="lg"
                                    onClick={() => { navigate("/login"); toggleMenu(); }}
                                    className="w-full font-medium"
                                >
                                    Login
                                </Button>
                            ) : (
                                <LogoutButton 
                                    variant="destructive" 
                                    size="lg" 
                                    onClick={() => toggleMenu()} // Close menu after initiating logout
                                    className="w-full font-medium"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;