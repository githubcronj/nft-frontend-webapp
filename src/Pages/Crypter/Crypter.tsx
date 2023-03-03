import React, { useContext, useState, useEffect } from "react";
import { FC } from "react";
import Carosel from "../../Components/Bidcard/Carosel";
import { CradCollection } from "../../Components/CardCollection/CradCollection";
import CreatorsBid from "../../Components/CreatorsBid/CreatorsBid";
import CrypterEnd from "../../Components/CrypterEnd/CrypterEnd";
import BidCarousel from "../../Components/CurrentBid/BidCarousel";
import SellerBuyerCard from "../../Components/SellerBuyerCard/SellerBuyerCard";
import Discover from "../DiscoverHomePage/Discover";
import "./Crypter.css";
import { Container, Box } from "@mui/material";
import { setNfts } from "../../redux/slices/NFTs";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { setTimeout } from "timers/promises";
import { setAddress } from "../../redux/slices/UserSlice";
import { apiClient } from "../../axios/instance";
import { NFT_MARKETPLACE_ADDRESS } from "../../constants/Constants";
import { useActiveListings, useContract } from "@thirdweb-dev/react";
import { Toaster } from "react-hot-toast";

const Crypter: FC = () => {
  const { account } = useWeb3React<Web3Provider>();

  // console.log("CRpter acc -> ", account);
  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const dispatch = useAppDispatch();
  const { contract } = useContract(NFT_MARKETPLACE_ADDRESS, "marketplace");
  // console.log("Cotnract -> ", contract);
  const { data: listings, isLoading: isListingLoading } =
    useActiveListings(contract);
  // console.log("LISTINGSssss -> ", listings);

  // const fetchNFTs = () =>
  //   apiClient
  //     .get("/nfts")
  //     .then((response) => response.data.data)
  //     .then((data) => {
  //       // setEventDetails(data)
  //       // dispatch(setNfts(data));
  //       console.log("Response -> ", data);
  //       dispatch(setNfts(data));
  //     });

  useEffect(() => {
    // fetchNFTs()
    //   .then((res: any) => {
    //     if (res) {
    //       dispatch(setNfts(res));
    //     }
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //   });
    if (listings?.length) {
      dispatch(setNfts(listings));
    }
  }, [listings]);
  // useEffect(() => {
  //   fetchNFTs();
  // }, []);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Container sx={{ overflowX: "hidden" }}>
        <BidCarousel />
        {/* <CreatorsBid /> */}
      </Container>
      {/* <SellerBuyerCard /> */}
      <Container sx={{ overflowX: "hidden" }}>
        <Discover />
        {/* <Carosel /> */}
        {/* <CradCollection /> */}
        <CrypterEnd />
      </Container>
    </>
  );
};
export default Crypter;
