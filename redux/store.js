import {configureStore} from "@reduxjs/toolkit";
import imageDataSlice from "./slices/imageDataSlice";
import userInfoSlice from "./slices/userInfoSlice";
import onedriveSlice from "./slices/onedriveSlice";

const store = configureStore({
    reducer: {
        imageDataSlice,
        userInfoSlice,
        onedriveSlice
    }
})

export default store