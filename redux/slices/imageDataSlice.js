import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    totalPage: 0,
    imageList : []
}

const imageDataSlice = createSlice(
    {
        name: "imageDataSlice",
        initialState,
        reducers: {
            setImageList: (state, action) => {
                state.imageList = action.payload.imageList;
            },
            setTotalPage: (state, action) => {
                state.totalPage = action.payload.totalPage
            }
        }
    }
)

export default imageDataSlice.reducer

export const {setImageList, setTotalPage} = imageDataSlice.actions