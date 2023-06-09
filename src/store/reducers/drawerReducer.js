import { createSlice } from "@reduxjs/toolkit";

export const drawerSlice = createSlice({

    name: 'drawer',
    initialState: false,
    reducers: {
        SET_VISIBLE: (state , action) => {
            return action.payload;  
        },
        // Add a default case that returns the current state
        DEFAULT: (state) => {
            return state;
        }
    }
});


export const { SET_VISIBLE, DEFAULT } = drawerSlice.actions;

export default drawerSlice.reducer;