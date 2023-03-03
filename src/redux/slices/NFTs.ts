import { createSlice } from "@reduxjs/toolkit";

interface State{
    nfts: any[],
    selectedNft: any
}

const initialState: State={
    nfts:[],
    selectedNft:null
}

const nftsDataSlice= createSlice({
    name:'nfts-data',
    initialState,
    reducers:{
        setNfts:(state, action)=>{
            // console.log("PAY:LOAD __> ",action.payload)
            state.nfts = action.payload
        },
        setSelectedNft:(state,action)=>{
            state.selectedNft= action.payload
        },
        removeSelectedNft:(state, action)=>{
            state.selectedNft=null
        }
    }
})


export  const {setNfts, setSelectedNft, removeSelectedNft}= nftsDataSlice.actions
export default nftsDataSlice.reducer