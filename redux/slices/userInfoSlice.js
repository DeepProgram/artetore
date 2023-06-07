import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    token: ""
}

const userInfoSlice = createSlice({
    name: "userinfoSlice",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token
        }
    }
})

export default userInfoSlice.reducer
export const  {setToken} = userInfoSlice.actions