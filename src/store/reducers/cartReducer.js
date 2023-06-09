import { createSlice } from "@reduxjs/toolkit";

// load cart items from local storage if any
let localStorageGotSomething = [];

if(typeof window !== "undefined") {
    if(localStorage.getItem('cart')) {
        localStorageGotSomething = JSON.parse(localStorage.getItem('cart'));
    } else {
        localStorageGotSomething = [];
    }
}

export const cartSlice = createSlice({

    name: 'cart',
    initialState: localStorageGotSomething,
    reducers: {
        ADD_TO_CART: (state , action) => {
            return action.payload;  
        },
        // Add a default case that returns the current state
        DEFAULT: (state) => {
            return state;
        }
    }
});


export const { ADD_TO_CART, DEFAULT } = cartSlice.actions;

export default cartSlice.reducer;