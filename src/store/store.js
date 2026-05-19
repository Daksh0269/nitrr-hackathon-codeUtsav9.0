import {configureStore} from '@reduxjs/toolkit'
import authSlice from '../features/authSlice'
import courseSlice from '../features/coursesSlice'
import notesSlice from '../features/notesSlice'

const store = configureStore({
  reducer: {
    auth: authSlice,
    course : courseSlice,
    notes : notesSlice,
  }
})

export default store
