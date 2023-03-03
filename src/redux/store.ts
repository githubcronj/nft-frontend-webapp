import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./slices/UserSlice";
import NFTSlice from './slices/NFTs'
import ProfileSlice from "./slices/ProfileSlice";
import CollectinSlice from "./slices/CollectinSlice";

const store = configureStore({
  reducer: {
    userData: UserSlice,
    nftsData: NFTSlice,
    profileData: ProfileSlice,
    collectinSlice : CollectinSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
