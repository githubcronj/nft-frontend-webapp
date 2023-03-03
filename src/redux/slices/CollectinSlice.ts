import { createSlice } from "@reduxjs/toolkit";

interface userState {
    collections:any
}
const initialState: userState = {
    collections:[]
}

const CollectinSlice = createSlice({
    name: "Uesr Data",
    initialState,
    reducers: {
        setUserCollection : (state,action ) => {
            console.log("in REDUX -->>",action.payload)
            state.collections = action.payload
        },
    }
})

export const { setUserCollection } = CollectinSlice.actions;

export default CollectinSlice.reducer;