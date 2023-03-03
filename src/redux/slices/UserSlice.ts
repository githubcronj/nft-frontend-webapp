import { createSlice } from "@reduxjs/toolkit";

interface userState {
    address: string
    bio:string
    name:string
    personalUrl:string
    twitter:string
    uId:string
    createdAt:string
}
const initialState: userState = {
    address: "",
    bio:"",
    name:"",
    personalUrl:"",
    twitter:"",
    uId:"", 
    createdAt:"",

}

const UserSlice = createSlice({
    name: "Uesr Data",
    initialState,
    reducers: {
        setAddress: (state, action) => {
            console.log(action.payload)
            state.address = action.payload.address
            state.bio=action.payload.bio
            state.name=action.payload.name
            state.personalUrl=action.payload.personalUrl
            state.twitter=action.payload.twitter
            state.uId = action.payload.uId
            state.createdAt = action.payload.createdAt
            // state.collections = action.payload.collections
        },
        deleteAddress: (state, action) => {
            state.address = "";
        },
    }
})


export const { setAddress, deleteAddress } = UserSlice.actions;

export default UserSlice.reducer;