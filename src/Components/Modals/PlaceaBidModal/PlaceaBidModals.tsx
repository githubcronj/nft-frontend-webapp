import "./PlaceaBidModals.css";
import { Typography, Button, styled, Box } from "@mui/material";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import cross from "../../../Assets/images/cross.svg";
import { useState } from "react";
import ButtonComponent from "../../../Common/ButtonComponent/ButtonComponent";
import pencil from "../../../Assets/images/pencil.svg";
import upload from "../../../Assets/images/upload.svg";
import bag from "../../../Assets/images/bag.svg";
import greentick from "../../../Assets/images/greentick.svg";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedNft } from "../../../redux/slices/NFTs";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { Balance } from "../../../context/Balance";
import {
  NFT_COLLECTION_ADDRESS,
  NFT_MARKETPLACE_ADDRESS,
} from "../../../constants/Constants";
import {
  useContract,
  useNetwork,
  useNetworkMismatch,
  useMakeOffer,
  useMakeBid,
  useBuyNow,
  useAddress,
} from "@thirdweb-dev/react";
import netowork from "../../../utils/netowork";
import { ethers } from "ethers";
import { GasCostEstimator } from "@thirdweb-dev/sdk";
import toast from "react-hot-toast";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    p: true;
  }
}

interface placeabidprops {
  value?: number;
  children?: JSX.Element | JSX.Element[] | string[];
  title?: string;
  ETHone?: string | number;
  ETH2two?: string | number;
  modalhead1?: string;
  modalpara1?: string;
  modalnum?: number | string;
  modalpara2?: string;
  totalETH?: number;
  ETH1?: number | string;
  BoxText1?: string;
  ETH2?: number | string;
  BoxText2?: string;
  ETH3?: number | string;
  BoxText3?: string;
  head?: string;
  subhead1?: string;
  subhead2?: string;
  subhead3?: string;
  smalltext1?: string;
  smalltext2?: string;
  smalltext3?: string;
  bidcard?: boolean;
  logo?: string;
  cardData?: any;
  type?: any;
  values?: any;
  listing?: any;
  buyNFT?: any;
}

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  bgcolor: "background.paper",
  p: 2,
  px: 3,
  pb: 3,
  backgroundColor: "#FCFCFD",
  borderRadius: "10px",
};

const PlaceaBidModals = (props: placeabidprops) => {
  // console.log("in Place a bid -> ", props.values);
  // console.log("Item check  -> ", props.listing);
  const [open, setOpen] = useState<boolean>(false);
  const { account } = useWeb3React<Web3Provider>();
  const address = useAddress();
  // const contract = useContract(NFT_COLLECTION_ADDRESS, "nft-collection");
  // const { mutate: makeOffer } = useMakeOffer(contract);
  const [offerPrice, setOfferPrice] = useState<any>();
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [modal1, setModal1] = useState<boolean>(true);
  const [modal2, setModal2] = useState<boolean>(false);

  const [style1, setStyle1] = useState("startnowbtn");
  const [style2, setStyle2] = useState("startnowbtn");
  const [style3, setStyle3] = useState("startnowbtn");

  const [active1, setActive1] = useState<boolean>(true);
  const [active2, setActive2] = useState<boolean>(true);
  const [active3, setActive3] = useState<boolean>(true);

  const [buttonText1, setButtonText1] = useState<string>("Start now");
  const [buttonText2, setButtonText2] = useState<string>("Start now");
  const [buttonText3, setButtonText3] = useState<string>("Start now");

  const handleClick1 = () => {
    setStyle1("mybtn");
    setActive1(false);
    setButtonText1("done");
  };
  const handleClick2 = () => {
    setStyle2("mybtn");
    setActive2(false);
    setButtonText2("done");
  };
  const handleClick3 = () => {
    setStyle3("mybtn");
    setActive3(false);
    setButtonText3("done");
  };
  const handleOpenModal1 = () => {
    setModal1((modal1) => true);
    setModal2((modal2) => false);
  };

  const handleOpenModal2 = () => {
    setModal2((modal2) => true);
    setModal1((modal1) => false);
  };
  // console.log("OWNED!! --> ", props);
  // console.log("TYPE CHECK!! --> ", props.cardData.type);
  const dispatch = useDispatch();
  const onClickHandler = () => {
    dispatch(setSelectedNft(props.cardData));
    if (props.cardData.type === "owned" || props.values === 2) {
      navigate(`/item-owned?id=${props.cardData?.id}`);
    } else {
      navigate(`/item?id=${props.cardData?.id}`);
    }
  };
  const handleNavigate = () => {
    navigate("/connect-wallet");
  };

  const { contract } = useContract(NFT_MARKETPLACE_ADDRESS, "marketplace");

  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const listingId = props.listing?.id;
  // const listingId = props.cardData?.asset.id;
  // console.log("Listing id for MAO", listingId);
  // console.log("BUYOUT PRICE ->", props?.listing?.buyoutPrice.toString());

  const {
    mutate: makeOffer,
    isLoading: offerLoading,
    error: offerError,
  } = useMakeOffer(contract);

  const {
    mutate: makeBid,
    isLoading: auctionLoadin,
    error: actionError,
  } = useMakeBid(contract);

  // const {
  //   data: offers,
  //   isLoading: makeAnOfferLoading,
  //   error: makeAnOfferError,
  // } = useOffers(contract, listingId);

  // const offers = useOffers(contract, props?.cardData?.id);

  // console.log("OFFERS -> ", offers);

  const createOffer = async () => {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(netowork);
        return;
      }
      //0 is direct listing
      if (props.listing?.type === 0) {
        if (
          props.listing.buyoutPrice.toString() ===
          ethers.utils.parseEther(offerPrice).toString()
        ) {
          console.log("Buyout price met, Buying NFT...");
          props.buyNFT();
          return;
        }
        console.log("Buyout price not met, Making offer...");
        console.log(
          "WRITTEN PRICE ->",
          ethers.utils.parseEther(offerPrice).toString()
        );
        await makeOffer(
          {
            quantity: 1,
            listingId,
            pricePerToken: offerPrice,
          },
          {
            onSuccess(data, variables, context) {
              // alert("Offer made successfull!");
              console.log("SUCCESS :", data, variables, context);
              setOfferPrice("");
              toast.success("Offer made successfully!", {
                style: {
                  background: "#04111d",
                  color: "#fff",
                },
              });
              navigate("/home");
            },
            onError(error, variables, context) {
              // alert("Something went wrong, please try again");
              console.log("ERROR :", error, variables, context);
              toast.error(`Error occured, Please try again.`, {
                style: {
                  background: "#04111d",
                  color: "#fff",
                },
              });
              navigate("/home");
            },
          }
        );
      }
      //1 is auction listing
      if (props.listing?.type === 1) {
        console.log("Making Bid");

        await makeBid(
          {
            listingId,
            bid: offerPrice,
          },
          {
            onSuccess(data, variables, context) {
              // alert("Bid made successfully!");
              console.log("SUCCESS :", data, variables, context);
              setOfferPrice("");
              toast.success("Bid made successfully!", {
                style: {
                  background: "#04111d",
                  color: "#fff",
                },
              });
              navigate("/home");
            },

            onError(error, variables, context) {
              // alert("Something went wrong, please try again");
              console.log("ERROR :", error, variables, context);
              toast.error("Error occured, Please try again.", {
                style: {
                  background: "#04111d",
                  color: "#fff",
                },
              });
              navigate("/home");
            },
          }
        );
      }
    } catch (error) {
      console.log("Something went wrong : ", error);
    }
  };
  return (
    <>
      {props.bidcard ? (
        <Button
          onClick={onClickHandler}
          variant="contained"
          className="mybutton"
        >
          {/* Buy Now */}
          {props.values === 0
            ? "On Sale"
            : props.values === 1
            ? "Your Listed"
            : props.values === 2
            ? "Resell Now"
            : "Buy Now"}
          <img src={props.logo} alt="icon" className="bigiImg" />
        </Button>
      ) : address ? (
        <ButtonComponent
          handleClick={handleOpen}
          styleType="outline"
          classNames="ItemWhiteBtn"
        >
          {/* Make an Offer */}
          {props.listing?.type === 0 ? "Make an Offer" : "Bid in Auction"}
        </ButtonComponent>
      ) : (
        <ButtonComponent
          handleClick={handleNavigate}
          styleType="outline"
          classNames="ItemWhiteBtn"
        >
          {props.listing?.type === 0 ? "Make an Offer" : "Bid in Auction"}
        </ButtonComponent>
      )}

      {modal1 ? (
        <StyledModal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <Box sx={style}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4" component="div">
                {props.listing?.type === 0 ? "Make an Offer" : "Bid In Auction"}
              </Typography>
              <img
                className="crossimg"
                onClick={handleClose}
                src={cross}
                alt="img"
              />
            </Box>
            <Typography component="div" className="para1">
              {`Please enter your amount which you want to ${
                props.listing?.type === 0 ? "offer" : "bid"
              }`}
            </Typography>
            <Typography component="div" variant="h6">
              {props.listing?.type === 0 ? "Your Offer" : "You Bid"}
            </Typography>
            <Box
              sx={{
                justifyContent: "space-between",
                borderBottom: "1px solid gray",
                display: "flex",
                margin: "15px 0px",
              }}
            >
              {/* <Typography variant="h6" component="div">
                {props.modalnum ? props.modalnum : "0.007"}
              </Typography> */}
              <Box sx={{ display: "flex" }}>
                <input
                  type="text"
                  onChange={(e) => setOfferPrice(e.target.value)}
                  style={{
                    direction: "rtl",
                    border: "none",
                    fontWeight: "bold",
                    outline: "none",
                  }}
                />
                <Typography variant="h6" component="div">
                  {props.totalETH ? props.totalETH : "ETH"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <Typography variant="p" color="#777E90" component="div">
                {props.BoxText1 ? props.BoxText1 : " Your balance"}
              </Typography>
              <Typography variant="h6" component="div">
                <Balance />
              </Typography>
            </Box>
            <Box
              sx={{
                justifyContent: "space-between",

                display: "flex",
              }}
            >
              <Typography variant="p" color="#777E90" component="div">
                {props.BoxText2 ? props.BoxText2 : "Service fee"}
              </Typography>
              <Typography variant="h6" component="div">
                {props.ETH2 ? props.ETH2 : "0"} ETH
              </Typography>
            </Box>
            <Box
              sx={{
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <Typography variant="p" color="#777E90" component="div">
                {props.listing?.type === 0
                  ? "Total Offered Amount"
                  : " Total bid amount"}
              </Typography>
              <Typography variant="h6" component="div">
                {offerPrice} ETH
              </Typography>
            </Box>

            <Box className="buttonBox">
              <Button
                // onClick={handleOpenModal2}
                onClick={createOffer}
                className="px-4 me-3 rounded-pill startnowbtn"
              >
                I Understand, Continue
              </Button>

              <Box className="cancelbtnbox">
                <Button
                  onClick={handleClose}
                  className=" rounded-pill cancelbtn"
                >
                  cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </StyledModal>
      ) : modal2 ? (
        <StyledModal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <Box sx={style}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h4" gutterBottom component="div">
                {props.head ? props.head : "Follow steps"}
              </Typography>
              <img
                className="crossimg"
                src={cross}
                alt="img"
                onClick={handleClose}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                marginTop: "35px",
              }}
            >
              {active1 ? (
                <img src={upload} alt="img" />
              ) : (
                <img src={greentick} alt="img" />
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "30px",
                }}
              >
                <Typography component="div" variant="h6" className="subhead">
                  {props.subhead1 ? props.subhead1 : "Deposit ETH"}
                </Typography>
                <Typography
                  component="div"
                  className="subtext"
                  color="text.secondary"
                >
                  {" "}
                  {props.smalltext1
                    ? props.smalltext1
                    : "Send transaction with your wallet"}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Button className={style1} onClick={handleClick1}>
                {buttonText1}
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                marginTop: "35px",
              }}
            >
              {active2 ? (
                <img src={pencil} alt="img" />
              ) : (
                <img src={greentick} alt="img" />
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "30px",
                }}
              >
                <Typography component="div" variant="h6" className="subhead">
                  {props.subhead1 ? props.subhead1 : "Approve"}
                </Typography>
                <Typography
                  component="div"
                  color="text.secondary"
                  className="subtext"
                >
                  {" "}
                  {props.smalltext2
                    ? props.smalltext2
                    : " Checking balance and approving"}
                </Typography>
              </Box>
            </Box>
            <Button className={style2} onClick={handleClick2}>
              {buttonText2}
            </Button>

            <Box
              sx={{
                display: "flex",
                marginTop: "35px",
              }}
            >
              {active3 ? (
                <img src={bag} alt="img" />
              ) : (
                <img src={greentick} alt="img" />
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: "30px",
                }}
              >
                <Typography component="div" variant="h6" className="subhead">
                  {props.subhead1 ? props.subhead1 : " Signature"}
                </Typography>
                <Typography
                  component="div"
                  color="text.secondary"
                  className="subtext"
                >
                  {props.smalltext3
                    ? props.smalltext3
                    : "Create a signature to place a bit"}
                </Typography>
              </Box>
            </Box>
            <Button onClick={handleClick3} className={style3}>
              {buttonText3}
            </Button>
          </Box>
        </StyledModal>
      ) : null}
    </>
  );
};

export default PlaceaBidModals;
