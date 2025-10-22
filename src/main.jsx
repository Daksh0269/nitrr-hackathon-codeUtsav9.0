import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Clubs from './pages/Clubs.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import RegisterPage from './pages/RegisterPage.jsx'
import LoggedIn from './pages/LoggedIn.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path:"/clubs",
        element:<Clubs/>
      },
      {
        path:'/login',
        element: <LoginPage/>
      },
      {
        path:'/register',
        element:<RegisterPage/>
      },
      {
        path:'/loggedin',
        element:<LoggedIn/>
      }
      
     
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>

)
