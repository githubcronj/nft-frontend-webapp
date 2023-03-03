import { FC, useEffect, useState, useContext } from "react";
import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Textfield from "./Components/Textfield/TextField";
import { FollowersCard } from "./Components/FollowersCard/FollowersCard";
import SliderComponent from "./Components/Slider/Slider";
import { UsersCard } from "./Components/UsersCard/UsersCard";
import NoResultsPage from "./Pages/NoResultsPage/NoResultsPage";
import Faq from "./Components/Faq/Faq";
import Searchbar from "./Common/Searchbar/Searchbar";
import Carosel from "./Components/Bidcard/Carosel";
import { NotificationD } from "./Components/Notification/NotificationD";
import Upload from "./Pages/Upload/Upload";
import { CradCollection } from "./Components/CardCollection/CradCollection";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import SingleCollectible from "./Pages/SingleCollectible/Singlecollectible";
import Activity from "./Pages/Activity/Activity";
import SearchFilter from "./Components/SearchFilterPage/SearchFilter";
import Item from "./Components/Item/Item";
import BidCarousel from "./Components/CurrentBid/BidCarousel";
import Discover from "./Pages/DiscoverHomePage/Discover";
import Remove from "./Components/Modals/Remove/Remove";
import Transfer from "./Components/Modals/Transfer/Transfer";
import BurnToken from "./Components/Modals/BurnToken/BurnToken";
import Report from "./Components/Modals/Report/Report";
import FooterComponent from "./Common/FooterComponent/Footer";
import FollowModal from "./Components/Modals/FollowModal/FollowModal";
import NavbarComponent from "./Common/Navbar/NavbarComponent";
import { AcceptBid } from "./Components/Modals/FollowModal/AcceptBid";
import EditProfilePage from "./Pages/EditProfilePage/EditProfilePage";
import { ConnectWallet } from "./Pages/ConnectWallet/ConnectWallet";
import WalletName from "./Pages/ConnectWallet/WalletName";
import CreatorsBid from "./Components/CreatorsBid/CreatorsBid";
import SellerBuyerCard from "./Components/SellerBuyerCard/SellerBuyerCard";
import SellerBuyerCarousel from "./Components/SellerBuyerCard/SellerBuyerCarousel";
import Crypter from "./Pages/Crypter/Crypter";
import ChangePrice from "./Components/Modals/ChangePrice/ChangePrice";
import MultipleCollectible from "./Pages/SingleCollectible/MultipleCollectible";
import WalletCard from "./Components/WalletCard/WalletCard";
import ProfileCard from "./Components/ProfileCard/ProfileCard";
import LocalStorage from "./Components/LocalStorage/LocalStorage";
import ScrollToTop from "./Components/ScrollTop";
import { useDispatch } from "react-redux";
import { setAddress } from "./redux/slices/UserSlice";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { connectorInfo } from "./Pages/ConnectWallet/Connectors";
import { NFTMarketplaceContext } from "./context/NFTMarketplaceContext";
import TestForm from "./Pages/SingleCollectible/TestForm";
import ItemProfileOwned from "./Components/Item/ItemProfileOwned";
import SearchCollectionFilter from "./Components/SearchFilterPage/SearchCollectionFilter";
import axios from "axios";
import { setNfts } from "./redux/slices/NFTs";
import { apiClient } from "./axios/instance";
import { setUserCollection } from "./redux/slices/CollectinSlice";
import { Balance } from "./context/Balance";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Listing from "./Pages/SingleCollectible/Listing";
import Web3 from "web3";
import { setTimeout } from "timers/promises";
const App: FC = () => {
  // const { checkIfWalletConnected } = useContext(NFTMarketplaceContext);

  // useEffect(() => {
  //   checkIfWalletConnected();
  // }, []);

  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();
  const navigate = useNavigate();

  const [connected, setConnected] = LocalStorage("connected", false);
  const [walletName, setWalletName] = LocalStorage("walletName", "");
  const {
    activate,
    deactivate,
    account,
    active,
    connector,
    chainId,
    library,
    error,
  } = useWeb3React<Web3Provider>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      connectWithMetaMask();
    }
    if (address) {
      navigate("/home");
    }
  }, [address]);

  const walletIdPostBackend = async () => {
    const data = {
      walletId: address,
    };
    console.log("data to post", data);
    // const config = {
    //   headers: { "Content-Type": "application/json" },
    // };
    try {
      console.log("INSIDE USER CREATE");
      const results = await axios.post(
        `http://localhost:5000/api/v1/userCreate`,
        data
        // config
      );
      console.log("WALLET ID POST --->", results.data);
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (address) {
      walletIdPostBackend();
    }
  }, [address]);

  return (
    <div>
      <NavbarComponent connected={connected} setConnected={setConnected} />
      <ScrollToTop />
      <Routes>
        <Route path="/testing" element={<TestForm />} />
        <Route
          path="/connect-wallet"
          element={<ConnectWallet setConnected={setConnected} />}
        />
        <Route
          path="wallet-card"
          element={<WalletCard setConnected={setConnected} />}
        />
        <Route path="/home" element={<Crypter />} />
        <Route path="/slider" element={<SliderComponent />} />
        <Route path="/balance" element={<Balance />} />

        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/item" element={<Item />} />
        <Route path="/item-owned" element={<ItemProfileOwned />} />
        <Route path="/textfield" element={<Textfield />} />
        <Route path="/users-card" element={<UsersCard />} />
        <Route path="/no-results-page" element={<NoResultsPage />} />
        <Route path="/single-collectible" element={<SingleCollectible />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/searchbar" element={<Searchbar />} />
        <Route path="/carosel" element={<Carosel />} />
        <Route path="/followers-card" element={<FollowersCard />} />
        <Route path="/notification-display" element={<NotificationD />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/card-collection" element={<CradCollection />} />
        {/* {account && <Route path="/profile-page" element={<ProfilePage />} />} */}
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/activity" element={<Activity />} />
        <Route
          path="/search-filter/collection/:collection"
          element={<SearchCollectionFilter />}
        />
        <Route path="/search-filter" element={<SearchFilter />} />
        <Route path="/home-page" element={<BidCarousel />} />
        <Route path="/current-bid" element={<BidCarousel />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/wallet-name" element={<WalletName />} />
        <Route path="/remove" element={<Remove />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/burn" element={<BurnToken />} />
        <Route path="/report" element={<Report />} />
        <Route path="/home" element={<Crypter />} />

        {/* <Route path="/crypter-end" element={<CrypterEnd />} /> */}
        <Route path="/follow" element={<FollowModal />} />
        <Route path="/creators" element={<CreatorsBid />} />
        <Route path="/multiple-collectible" element={<MultipleCollectible />} />
        <Route path="/seller-buyer-card" element={<SellerBuyerCard />} />
        <Route path="/change-price" element={<ChangePrice />} />
        <Route path="/accept" element={<AcceptBid />} />
        <Route path="/edit-profile-page" element={<EditProfilePage />} />
        <Route
          path="/seller-buyer-carousel"
          element={<SellerBuyerCarousel />}
        />
        <Route path="*" element={<Navigate to="/connect-wallet" />} />
      </Routes>
      <FooterComponent />
    </div>
  );
};

export default App;
