import React, { useState, useEffect, useContext } from "react";
import web3Mondal from "web3modal";
import { ethers, Contract } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

import { NFTMarketplaceAddress, NFTMarketplaceABI } from "./Constants";
import { createDraftSafeSelector } from "@reduxjs/toolkit";
import { Buffer } from "buffer";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../axios/instance";

// const url="https://mainnet.infura.io/v3/1b9b87cc48994172bae3f2e3856c8221"

// Buffer.from("anything", "base64");

// const client = ipfsHttpClient("http://ipfs.infura.io:5001/api/v0");

const subdomain = "https://web3-test-project.infura-ipfs.io";

const auth = `Basic ${Buffer.from(
  `${process.env.REACT_APP_PROJECT_ID}:${process.env.REACT_APP_PROJECT_SECRET_ID}`
).toString("base64")}`;

const client = ipfsHttpClient({
  // host: "ipfs.infura.io",
  host: "infura-ipfs.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
//--fetch smart contract
const fetchContract = (signerOrProvider: any) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

//connecting with smart contract
const connectingWithSmartContract = async () => {
  try {
    // const { ethereum } = window;
    // // const provider = new ethers.providers.Web3Provider(ethereum);
    // const provider = new ethers.providers.Web3Provider();
    // const signer = provider.getSigner();
    // const contract = fetchContract(signer);
    // return contract;
  } catch (error) {
    console.log("Something went wrong -->>>", error);
  }
};

interface Data {
  tokenId: any;
  seller: any;
  owner: any;
  price: any;
}

export const NFTMarketplaceContext = React.createContext<any>(null);

interface ProviderValue {
  checkIfWalletConnected: any;
  connectWallet: any;
  uploadToIPFS: any;
  createNFT: any;
  fetchNFTs: any;
  fetchhMyNFTsOrListedNFTs: any;
  buyNFTs: any;
  currentAccount: any;
  setCurrentAccount: any;
  createSale?: any;
}

export const NFTMarketplaceProvider = ({ children }: { children: any }) => {
  const {
    activate,
    deactivate,
    account,
    active,
    connector,
    chainId,
    library: provider,
    error,
  } = useWeb3React<Web3Provider>();

  const [currentAccount, setCurrentAccount] = useState<any>();

  //check if wallet is connected or not
  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log("Install MetaMask");
      }

      // const account = await window.ethereum.request({
      //   method: "eth_accounts",
      // });

      // if (account.length) {
      //   setCurrentAccount(account[0]);
      // } else {
      //   console.log("No Account Found");
      // }
      // console.log("current account -> ", currentAccount);
    } catch (error) {
      console.log("something went wrong while connecting the wallet");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Install MetaMask");

      // const account = await window.ethereum.request({
      //   method: "eth_requestAccounts",
      // });
      if (account?.length) {
        setCurrentAccount(account[0]);
      }

      // window.location.reload();
    } catch (error) {
      console.log("Error while connecting the wallet");
    }
  };

  //upload image to ipfs
  const uploadToIPFS = async (file: any) => {
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error while uploading to IPFS", error);
    }
  };

  //Create NFT Function
  type Details = {
    walletId: string;
    name: string;
    description: string;
    price: string;
    image: string;
    category: string;
    collections: string;
    date: string;
  };
  const createNFT = async (details: Details) => {
    const { price } = details;

    const data = JSON.stringify(details);

    try {
      const added = await client.add(data);

      const url = `https://infura-ipfs.io/ipfs/${added.path}`;

      await createSale(url, price, false, "");
      console.log("Data uploaded successfully");
      // alert("NFT Created Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const createSale = async (
    url: string,
    formInputPrice: string,
    isReselling: boolean,
    id: string
  ) => {
    try {
      const price = ethers.utils.parseUnits(formInputPrice, "ether");
      const contract: any = await connectingWithSmartContract();
      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();
      console.log(transaction);
    } catch (error) {
      console.log("Error while creating sale", error);
    }
  };

  //fetch nft function
  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-goerli.alchemyapi.io/v2/5nUo5YmuBU8FQYxNiXKqWWlxxXmUXHex"
      );
      const contract = fetchContract(provider);
      const data = await contract.fetchMarketItems();
      console.log("checking nft --> ", data);

      const dataPromiseArr = data.map(
        async ({ tokenId, seller, owner, price: unformattedPrice }: Data) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: {
              image,
              name,
              description,
              collections,
              category,
              date,
              walletId,
            },
          } = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            "ether"
          );
          return {
            price,
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
            category,
            collections,
            date,
            walletId,
          };
        }
      );

      const items = await Promise.allSettled(dataPromiseArr);
      const results = items
        .filter((item) => item.status === "fulfilled")
        .map((item: any) => item.value);
      return results;
    } catch (error) {
      console.log("Error while fetching nft's", error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  //Fetch my nft or listed nft
  const fetchhMyNFTsOrListedNFTs = async (type: any) => {
    try {
      const contract: any = await connectingWithSmartContract();
      const data: any[] =
        type == "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const dataPromiseArr = data.map(
        async ({ tokenId, seller, owner, price: unformattedPrice }: Data) => {
          const tokenURI = await contract.tokenURI(tokenId);
          const {
            data: {
              image,
              name,
              description,
              category,
              collections,
              date,
              walletId,
            },
          } = await axios.get(tokenURI);
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            "ether"
          );

          return {
            price,
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            image,
            name,
            description,
            tokenURI,
            category,
            collections,
            date,
            walletId,
          };
        }
      );

      const items = await Promise.allSettled(dataPromiseArr);
      const results = items
        .filter((item) => item.status === "fulfilled")
        .map((item: any) => item.value);
      return results;
    } catch (error) {
      console.log("error while fetching listed nft", error);
    }
  };

  //Buy nft's
  const buyNFTs = async (nft: any) => {
    console.log(nft);
    // const navigate = useNavigate();
    try {
      const contract: any = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
      console.log("Buying successfull -> ", transaction);
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const dataPurchase = {
        price: nft.price,
        tokenId: nft.tokenId,
        from: transaction.from,
        to: transaction.to,
      };
      const results = await apiClient.post(
        `/admin/transaction`,
        dataPurchase,
        config
      );
      console.log("Backend Data Post --> ", results);
    } catch (error) {
      console.log("Error while buying nfts", error);
      // navigate("/search-filter");
    }
  };

  const valueObj: ProviderValue = {
    checkIfWalletConnected,
    connectWallet,
    uploadToIPFS,
    createNFT,
    fetchNFTs,
    fetchhMyNFTsOrListedNFTs,
    buyNFTs,
    createSale,
    currentAccount,
    setCurrentAccount,
  };

  return (
    <NFTMarketplaceContext.Provider value={valueObj}>
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
