import {createSlice} from "@reduxjs/toolkit";

const  initialState = {
    // 0 -> Not Connected
    // 1 -> Connected
    connectionStatus: 0,
    folders: {},

}

const onedriveSlice = createSlice({
    name: "onedriveSlice",
    initialState,
    reducers: {
        setConnectionStatus: (state, action) => {
            state.connectionStatus = action.payload.connected
        },
        setFolders: (state, action) => {
            state.folders = action.payload.folders
        }
    }
})

export default onedriveSlice.reducer
export const {setConnectionStatus, setFolders} = onedriveSlice.actions