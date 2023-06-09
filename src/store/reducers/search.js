import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name:'search',
    initialState:{text: ""},
    reducers:{
        SEARCH_QUERY: (state = {text: ""}, action) => {
            return { ...state, ...action.payload};  // ... is useful when hv more than 1 later , but now we hv only text:
        }
    }
});


export const { SEARCH_QUERY } = searchSlice.actions;

export default searchSlice.reducer;