import { createSlice } from "@reduxjs/toolkit";

export const couponSlice = createSlice({

    name: 'coupon',
    initialState: false,
    reducers: {
        COUPON_APPLIED: (state , action) => {
            return action.payload;  
        }
    }
});


export const { COUPON_APPLIED } = couponSlice.actions;

export default couponSlice.reducer;