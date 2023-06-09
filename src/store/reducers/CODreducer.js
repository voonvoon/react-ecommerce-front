import { createSlice } from "@reduxjs/toolkit";

export const codSlice = createSlice({

    name: 'cod',
    initialState: false,
    reducers: {
        COD_PAY: (state , action) => {
            return action.payload;  
        }
    }
});


export const { COD_PAY } = codSlice.actions;

export default codSlice.reducer;