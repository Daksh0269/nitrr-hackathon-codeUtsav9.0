import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import './App.css'
import { useDispatch } from 'react-redux'
import Navbar from './LayoutUI/navbar/navbar'
function App() {
//  const dispatch = useDispatch();
 return (
    <>
      <Navbar/>
      <Outlet />
    </>
  );
}

export default App
