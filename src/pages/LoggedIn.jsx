// ...existing code...
import React from 'react'
import { useSelector } from 'react-redux'

const LoggedIn = () => {
  const user = useSelector((state) => state.auth.userData)
  console.log("user --->", user)

  return (
    <div>
      Hello there, you are logged in {user?.name ?? user?.email ?? user?.$id}
    </div>
  )
}

export default LoggedIn
// ...existing code...