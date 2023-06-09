import { createSlice } from "@reduxjs/toolkit";


export const usersSlice = createSlice({
    name:'users',
    initialState:null,
    reducers:{
        loggedInUser: (state  , action) => {
            return action.payload;
            //return { ...state, ...action.payload}
        },
        logoutUser : (state, action) => {
            return action.payload;
        }
    }
});

//testing
// export const usersSlice = createSlice({
//     name:'users',
//     initialState:{users: ""},
//     reducers:{
//         loggedInUser: (state= {users: ""}  , action) => {
//             //return action.payload;
//             return { ...state, ...action.payload}
//         },
//         logoutUser : (state, action) => {
//             return action.payload;
//         }
//     }
// });


export const { loggedInUser,logoutUser } = usersSlice.actions;

export default usersSlice.reducer;
