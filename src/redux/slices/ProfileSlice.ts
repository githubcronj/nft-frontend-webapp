import { createSlice } from "@reduxjs/toolkit";

interface State{
    selectedNft: any
    listedNFT: any[],
    ownedNFT: any[],
}

const initialState: State={
    selectedNft:null,
    listedNFT:[],
    ownedNFT:[]
}

const ProfileSlice= createSlice({
    name:'profile-slice',
    initialState,
    reducers:{
        listedProfileNFT:(state, action)=>{
            state.listedNFT= action.payload
        },
        ownedProfileNFT:(state,action)=>{
            state.ownedNFT= action.payload
        },
        setSelectedNft:(state,action)=>{
            state.selectedNft= action.payload
        },
        removeSelectedNft:(state, action)=>{
            state.selectedNft=null
        }
    }
})


export  const {listedProfileNFT, ownedProfileNFT, setSelectedNft,removeSelectedNft}= ProfileSlice.actions
export default ProfileSlice.reducer