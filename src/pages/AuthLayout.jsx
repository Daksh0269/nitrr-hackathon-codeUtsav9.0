import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';

function AuthLayout({ children, authenticationStatus = true }) {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {

        if (authenticationStatus && authStatus !== authenticationStatus) {
            navigate('/login')
        }
        else if (!authenticationStatus && authStatus) {
            navigate('/')
        }
        setLoader(false)
    }, [authenticationStatus, navigate, authStatus])
    

    return loader ? (
         <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
            Loading authorization...
        </div>
    ) : (
        <>{children}</>
    )
}

export default AuthLayout