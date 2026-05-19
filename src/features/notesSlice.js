import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notes: [],
    notesLoaded: false, // Flag to prevent redundant notes fetches
};

const notesSlice = createSlice({
    name: "notes",
    initialState,
    reducers: {
        setNotes: (state, action) => {
            state.notes = action.payload;
            state.notesLoaded = true;
        },
        addNoteToStore: (state, action) => {
            state.notes.unshift(action.payload); // Adds new note immediately to the top of the feed
        }
    }
});

export const { setNotes, addNoteToStore } = notesSlice.actions;
export default notesSlice.reducer;