import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import authService from '../../appwrite/auth';
import { logout } from '../../features/authSlice';
import Button from './Button';

function LogoutButton(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate(); 


    const handleLogout = () => {
        authService.logout()
            .then(() => {
                dispatch(logout());
                navigate('/login'); 
            })
            .catch((error) => {
                console.log('Error in logging out:', error);
                navigate('/login'); 
            });
    };

    return (
        <Button
            onClick={handleLogout}
            variant="destructive" 
            size="sm"
            {...props}
        >
            Logout
        </Button>
    );
}

export default LogoutButton;