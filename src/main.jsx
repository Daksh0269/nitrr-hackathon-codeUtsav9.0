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
import CourseRatingsTest from './pages/CoursesReview.jsx'
import AuthLayout from './pages/AuthLayout.jsx'
import CourseDetail from './LayoutUI/courseUI/CourseDetail.jsx'
import CourseDetailPage from './pages/CourseDetailPage.jsx'
import ReviewSubmissionPage from './pages/ReviewSubmissionPage.jsx'
import CoursesAndReviews from './pages/CoursesReview.jsx'
import ClubDetailPage from './pages/Clubs/ClubDetailPage.jsx'
import UploadNotePage from './pages/Notes/UploadNotesPage.jsx'
import NotesPage from './pages/Notes/NotesPage.jsx'
import AttendanceTracker from './pages/AttendancePage.jsx'
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
        path: "/clubs",
        element: <Clubs />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/loggedin',
        element: <AuthLayout authenticationStatus><LoggedIn /></AuthLayout>
      },
      {
        path: '/courses',
        element: <CoursesAndReviews/>,
      },
      {
        path: '/courses/:courseId', // NEW: Dynamic Route for Course Details
        element: <CourseDetailPage />
      },
      {
        path: '/submit-review',
        element: <ReviewSubmissionPage />
      },
      {
        path: '/clubs/:clubId', //
        element: <ClubDetailPage /> //
      },
      {
        path: '/notes',
        element: <NotesPage />
      },
      {
        path: '/upload-note',
        element: (
          <AuthLayout authenticationStatus>
            <UploadNotePage />
          </AuthLayout>
        )
      },
      {
        path: '/attendance',
        element: <AttendanceTracker />
      },

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
