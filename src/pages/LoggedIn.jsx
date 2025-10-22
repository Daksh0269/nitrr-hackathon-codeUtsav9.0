import React from 'react'
import { useSelector } from 'react-redux'
import authService from '../appwrite/auth'

const LoggedIn = () => {
  const user = useSelector((state)=>state.auth.userData)
  console.log("user --->",user)
  return (
    <div>Hello there you are logged in{user.name} </div>
  )
}

export default LoggedIn