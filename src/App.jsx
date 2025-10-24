import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import './App.css'
import { useDispatch } from 'react-redux'
import Navbar from './LayoutUI/navbar/navbar'
import authService from './appwrite/auth'; // Import authService
import { login, logout } from './features/authSlice'; // Import actions

function App() {
  const [loading, setLoading] = useState(true); // 1. New state to track auth loading
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for the persisted Appwrite session
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          // If session exists, dispatch login to populate Redux store
          dispatch(login({ userData }));
        } else {
          // If no session, dispatch logout to ensure status is false
          dispatch(logout());
        }
      })
      .finally(() => {
        // Mark loading complete, allowing the app to render
        setLoading(false);
      });
  }, [dispatch]); // Run once on mount

  // 2. Display a loader while authentication status is being determined
  return loading ? (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg">
        Checking authentication status...
    </div>
  ) : (
    <>
      <Navbar/>
      <Outlet />
    </>
  );
}

export default App;