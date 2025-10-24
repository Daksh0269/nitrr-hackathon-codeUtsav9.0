import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';

function AuthLayout({ children, authenticationStatus = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        // Since App.jsx initializes the state, we rely on the Redux store's status here.
        
        // Scenario 1: Authentication required (e.g., /loggedin) but user is not logged in
        if (authenticationStatus && authStatus !== authenticationStatus) {
            navigate('/login')
        }
        // Scenario 2: Authentication NOT required (e.g., /login, /register) but user IS logged in
        else if (!authenticationStatus && authStatus) {
            navigate('/')
        }
        setLoader(false)
    }, [authenticationStatus, navigate, authStatus])
    
    // FIX: Render children correctly instead of wrapping them in <h1>
    return loader ? (
         <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
            Loading authorization...
        </div>
    ) : (
        <>{children}</>
    )
}

export default AuthLayout