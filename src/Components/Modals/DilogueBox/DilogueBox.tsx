import { useState, useContext, useEffect } from "react";
import "./DilogueBox.css";
import { Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/system";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import cross from "../../../Assets/images/cross.svg";
import pinkicon from "../../../Assets/images/pinkicon.svg";
import CircularProgress from "@mui/material/CircularProgress";
import usersimg from "../../../Assets/images/usersimg.png";
import facebook from "../../../Assets/images/facebook.svg";
import insta from "../../../Assets/images/insta.svg";
import pintrest from "../../../Assets/images/pintrest.svg";
import twiterrr from "../../../Assets/images/twiterrr.svg";
import ButtonComponent from "../../../Common/ButtonComponent/ButtonComponent";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { NFTMarketplaceContext } from "../../../context/NFTMarketplaceContext";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Web3 from "web3";
import toast, { Toaster } from "react-hot-toast";
import { Balance } from "../../../context/Balance";
import {
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useOffers,
  useMakeOffer,
  useBuyNow,
  useAddress,
} from "@thirdweb-dev/react";
import { NFT_MARKETPLACE_ADDRESS } from "../../../constants/Constants";
import netowork from "../../../utils/netowork";
import { cardData } from "../../../DB/Activity/ActivityArray";
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    p: true;
  }
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
  px: 4,
  pb: 3,
  backgroundColor: "#FCFCFD",
  borderRadius: "10px",
};

interface DilogueModalsprops {
  value?: number;
  children?: JSX.Element | JSX.Element[] | string[];
  title?: string;
  ETH1?: string | number;
  ETH2?: string | number;
  modalhead1?: string;
  modalpara1?: string;
  modalnum?: number | string;
  nft?: any;
  buyNFT?: any;
}

const DilogueBox = (props: DilogueModalsprops) => {
  // const { account } = useWeb3React<Web3Provider>();
  const listingId = props.nft?.asset.id;
  const { contract } = useContract(NFT_MARKETPLACE_ADDRESS, "marketplace");
  const {
    data: listing,
    isLoading,
    error: buyNowError,
  } = useListing(contract, listingId);
  const address = useAddress();
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const {
    mutate: buyNow,
    isLoading: isBuyNowLoading,
    error: isBuyNowError,
  } = useBuyNow(contract);

  // console.log("MODAL --> ", props.nft);
  const [open, setOpen] = useState<boolean>(true);
  const [modal1, setModal1] = useState<boolean>(false);
  const [modal2, setModal2] = useState<boolean>(false);
  const [modal3, setModal3] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [processing, setProcessing] = useState<boolean>(true);
  const { buyNFTs } = useContext(NFTMarketplaceContext);
  const navigate = useNavigate();
  const handleOpen = () => {
    setOpen(true);
    setModal1(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal1 = () => {
    setModal1((modal1) => true);
    setModal2((modal2) => false);
  };

  const handleOpenModal2 = () => {
    setModal2((modal2) => true);
    setModal1((modal1) => false);
  };
  const profileUpdated = (toastHandler = toast) => {
    toastHandler.success("You bought an NFT Successfully!", {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
  };
  // const buyNFT = async () => {
  //   if (networkMismatch) {
  //     switchNetwork && switchNetwork(netowork);
  //     return;
  //   }
  //   await buyNow(
  //     {
  //       id: listingId,
  //       buyAmount: 1,
  //       type: props.nft.type,
  //     },
  //     {
  //       onSuccess(data, variables, context) {
  //         console.log("SUCCESS : ", data, variables, context);
  //         alert("NFT Bought Successfully");
  //         navigate("/home");
  //       },
  //       onError(error, variables, context) {
  //         console.log("ERROR : ", error, variables, context);
  //         alert("NFT could not be bought");
  //         navigate("/home");
  //       },
  //     }
  //   );
  // };

  const handleOpenModal3 = async () => {
    //buy nft
    props.buyNFT();
    // setProcessing(true);
    // await buyNFTs(props.nft)
    //   .then((result: any) => {
    //     console.log("NFT transaction successful", result);
    //     navigate("/profile-page");
    //   })
    //   .catch((e: any) => {
    //     alert("Error Occured while buying NFT");
    //     navigate("/search-filter");
    //   });
    // setProcessing(false);
    // setModal2((modal2) => false);
    // setModal3((modal3) => true);
  };

  // const { account } = useWeb3React<Web3Provider>();
  // var balance = Web3.eth.getBalance(account);

  const handleNavigate = () => {
    navigate("/connect-wallet");
  };
  return (
    <>
      {address ? (
        <ButtonComponent
          handleClick={handleOpen}
          classNames="itemBlueBtn"
          btnColor={"#3772FF"}
        >
          Purchase now
        </ButtonComponent>
      ) : (
        <ButtonComponent
          handleClick={handleNavigate}
          classNames="itemBlueBtn"
          btnColor={"#3772FF"}
        >
          Purchase now
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
              <Typography variant="h4" gutterBottom component="div">
                {props.modalhead1 ? props.modalhead1 : " Checkout"}
              </Typography>
              <img
                className="crossimg"
                onClick={handleClose}
                src={cross}
                alt="img"
                width={"35px"}
              />
            </Box>
            <Typography component="div" className="para1">
              {props.modalpara1
                ? props.modalpara1
                : `   You are about to purchase ${props.nft?.asset?.name} NFT from CronJ`}
            </Typography>

            <Box
              sx={{
                justifyContent: "space-between",
                borderBottom: "1px solid gray",
                display: "flex",
                margin: "15px 0px",
              }}
            >
              <Typography variant="h6" component="div">
                {/* {props.modalnum ? props.modalnum : "0.007"} */}
                {props.nft?.buyoutCurrencyValuePerToken.displayValue
                  ? props.nft.buyoutCurrencyValuePerToken.displayValue
                  : "Price not available"}
              </Typography>
              <Typography variant="h6" component="div">
                ETH
              </Typography>
            </Box>

            <Box
              sx={{
                justifyContent: "space-between",

                display: "flex",
              }}
            >
              <Typography variant="p" color="#777E90" component="div">
                Your balance
              </Typography>
              <Typography variant="h6" component="div">
                {/* 999.98 ETH */}
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
                Service fee
              </Typography>
              <Typography variant="h6" component="div">
                0.0000 ETH
              </Typography>
            </Box>
            <Box
              sx={{
                justifyContent: "space-between",

                display: "flex",
              }}
            >
              <Typography variant="p" color="#777E90" component="div">
                You will pay
              </Typography>
              <Typography variant="h6" component="div">
                {/* 0.007 ETH */}
                {props.nft?.buyoutCurrencyValuePerToken.displayValue} ETH
              </Typography>
            </Box>
            {/* <Box
              className="pinkBox"
              sx={{
                backgroundColor: "#EF466F14",
                display: "flex",
                justifyContent: "space-evenly",
                borderRadius: "10px",
                padding: "25px",
                margin: "15px 0px",
              }}
            >
              <Box>
                <img src={pinkicon} alt="img" width={"30px"} />
              </Box>
              <Box>
                <Typography variant="h6" className="pinkText">
                  This creator is not verified
                </Typography>
                <Typography variant="p" className="pinkText">
                  Purchase this item at your own risk
                </Typography>
              </Box>
            </Box> */}
            <Box className="buttonBox">
              <Button
                onClick={handleOpenModal2}
                className="px-4 me-3 rounded-pill startnowbtn"
              >
                I Understand, continue
              </Button>
              <Box className="cancelbtnbox">
                <Button
                  onClick={handleClose}
                  className=" rounded-pill cancelbtn "
                >
                  Cancel
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
                Follow steps
              </Typography>
              <img
                className="crossimg"
                src={cross}
                onClick={handleClose}
                alt="img"
                width={"35px"}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                margin: "30px 0px",
              }}
            >
              <Box>
                <CircularProgress disableShrink />
              </Box>
              <Box
                sx={{
                  marginRight: "80px",
                }}
              >
                <Typography variant="h6" component="div">
                  Purchasing
                </Typography>
                <Typography variant="p" color="#777E90" component="div">
                  Please click on continue to confirm your transaction.
                </Typography>
              </Box>
            </Box>
            {/* <Box
              className="pinkBox"
              sx={{
                backgroundColor: "#EF466F14",
                display: "flex",
                justifyContent: "space-evenly",
                borderRadius: "10px",
                padding: "25px",
                margin: "15px 0px",
              }}
            >
              <Box>
                <img
                  src={pinkicon}
                  alt="img"
                  className="pinkimg"
                  width={"30px"}
                />
              </Box>
              <Box>
                <Typography variant="h6" className="pinkText">
                  This creator is not verified
                </Typography>
                <Typography variant="p" className="pinkText">
                  Purchase this item at your own risk
                </Typography>
              </Box>
              <Box>
                <img
                  src={usersimg}
                  className="pinkimg"
                  alt="img"
                  width={"35px"}
                />
              </Box>
            </Box> */}
            <Box className="buttonBox">
              <Button
                className="px-4 me-3 rounded-pill startnowbtn"
                onClick={handleOpenModal3}
              >
                Continue
              </Button>
              <Box className="cancelbtnbox">
                <Button
                  onClick={handleClose}
                  className=" rounded-pill cancelbtn "
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </StyledModal>
      ) : modal3 ? (
        <StyledModal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          BackdropComponent={Backdrop}
        >
          <Box sx={style}>
            <img
              className="crossimg"
              src={cross}
              onClick={handleClose}
              alt="img"
              width={"35px"}
            />

            <Box className="modal5">
              <Typography variant="h4" component="div">
                Yay!
              </Typography>
              <Typography variant="p" component="div">
                You successfully purchased {props.nft?.name} from CronJ
              </Typography>
              <Box
                sx={{
                  borderRadius: "10px",
                  border: "1px solid #777E90",
                  width: "100%",
                  marginTop: "10px",
                  padding: "10px 10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "15px 0px",
                  }}
                >
                  <Typography variant="p" color="#777E90" component="div">
                    Status
                  </Typography>
                  <Typography variant="p" color="#777E90" component="div">
                    Transaction ID
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "15px 0px",
                  }}
                >
                  <Typography variant="p" color="green" component="div">
                    {/* Processing */}
                    {processing ? "Processing" : "Success"}
                  </Typography>
                  <Typography variant="p" color="#000000" component="div">
                    0msx836930...87r398
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: "20px",
                }}
              >
                <Typography variant="h6" component="div">
                  Time to show-off
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <a href="https://www.facebook.com/ui8.net/">
                  <img className="blue_img" src={facebook} />
                </a>
                <a href="https://twitter.com/ui8">
                  <img className="blue_img" src={twiterrr} />
                </a>
                <a href="https://www.instagram.com/ui8net/">
                  <img className="blue_img" src={insta} />
                </a>
                <a href="https://www.pinterest.com/ui8m/">
                  <img className="blue_img" src={pintrest} />
                </a>
              </Box>
            </Box>
          </Box>
        </StyledModal>
      ) : null}
    </>
  );
};

export default DilogueBox;
