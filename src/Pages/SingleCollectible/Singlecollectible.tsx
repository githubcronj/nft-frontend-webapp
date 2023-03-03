import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
  Box,
  styled,
  Switch,
  CardMedia,
  CardContent,
  Card,
  Avatar,
} from "@mui/material";
import Textfield from "../../Components/Textfield/TextField";
import { useState, useContext, useEffect } from "react";
import img1 from "../../Assets/images/bidImg.png";
import placeholderImage from "../../Assets/images/placeholder-image.png";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import bidIcon from "../../Assets/images/bidIcon.svg";
import candleStick from "../../Assets/images/candleStick.svg";
import rod1 from "../../Assets/images/rod1.svg";
import rod2 from "../../Assets/images/rod2.svg";
import rod3 from "../../Assets/images/rod3.svg";
import rod4 from "../../Assets/images/rod4.svg";
import plus1 from "../../Assets/images/plus1.svg";
import plus2 from "../../Assets/images/plus2.svg";
import plus3 from "../../Assets/images/plus3.svg";
import plus4 from "../../Assets/images/plus4.svg";
import buffer from "../../Assets/images/buffer.svg";
import creator from "../../Assets/images/creatorImg.png";
import "./SingleCollectible.css";
import Button from "@mui/material/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { FileUploader } from "react-drag-drop-files";
import FollowStep from "../../Components/Modals/FollowStepModals/FollowStep";
import PreviewModal from "../../Components/Modals/PreviewModal/PreviewModal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
//smart contract
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useAddress, useContract } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "../../constants/Constants";

export default function SingleCollectible(props: any) {
  const { uploadToIPFS, createNFT } = useContext(NFTMarketplaceContext);
  const { contract } = useContract(NFT_COLLECTION_ADDRESS, "nft-collection");

  // const { contract } = useContract(
  //   "0xf3d00fCEc73890b0c0f3b1484Ef79620640625fD",
  //   "nft-collection"
  // );
  const address = useAddress();

  // console.log("contract-> ", contract);

  console.log("address -> ", address);
  const [Picture, setPicture] = useState(true);
  const [Picture1, setPicture1] = useState(true);
  const [Picture2, setPicture2] = useState(true);
  const [Picture3, setPicture3] = useState(true);
  const [fileImg, setFileImg] = useState(null);
  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<any>(null);
  const [imageURL, setImageURL] = useState<string>("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [collections, setCollections] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [displayFollowSteps, setDisplayFollowSteps] = useState<boolean>(true);
  const { account } = useWeb3React<Web3Provider>();
  // console.log(file)
  const navigate = useNavigate();

  const changeDisplayFollowSteps = () => {
    setDisplayFollowSteps(false);
    setTimeout(() => {
      setDisplayFollowSteps(true);
    }, 0);
  };

  const convertFileToUrl = (file: any) => {
    const url = URL.createObjectURL(file);
    setImageURL(url);
    console.log("URL -> ", imageURL);
  };

  const changeBackground = () => {
    setPicture(false);
  };
  const changeBackgroundOut = () => {
    setPicture(true);
  };
  const changeBackground1 = () => {
    setPicture1(false);
  };
  const changeBackgroundOut1 = () => {
    setPicture1(true);
  };
  const changeBackground2 = () => {
    setPicture2(false);
  };
  const changeBackgroundOut2 = () => {
    setPicture2(true);
  };
  const changeBackground3 = () => {
    setPicture3(false);
  };
  const changeBackgroundOut3 = () => {
    setPicture3(true);
  };
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));
  const styleDirection = {
    display: "flex",
    justifyContent: "space-between",
  };

  const styleCol = {
    display: "flex",
    flexDirection: "column",
  };
  interface stateProps {
    file: string;
    tittle?: string;
  }

  const [pressed, setPressed] = useState<boolean>(false);
  const pressing = () => {
    setPressed(!pressed);
  };

  const handleChange = (file: any) => {
    // setFile(file);
    // convertFileToUrl(file);
    // console.log("File --> ", file);
    if (file.target.files?.[0]) {
      setPreview(URL.createObjectURL(file.target.files[0]));
      setFile(file.target.files[0]);
      console.log("URL -> ", preview);
    }
  };

  const sendFileToIPFS = async (e: any) => {
    try {
      const url = await uploadToIPFS(file);
      if (!url) throw Error("Error occured during file upload");
      setUploadedFile(url);
      console.log("file uploaded successfully");
    } catch (error: any) {
      console.log("Error sending File to IPFS: ");
      console.log(error);
      setError(error.message);
    }
  };

  // const createMyNFT = async () => {
  //   try {
  //     const detailsObj = {
  //       walletId: account,
  //       name,
  //       description,
  //       price,
  //       image: uploadedFile,
  //       category,
  //       collections,
  //       date: new Date().toString(),
  //     };
  //     await createNFT(detailsObj);
  //     setName("");
  //     setDescription("");
  //     setFile("");
  //     setUploadedFile("");
  //     setPrice("");
  //     navigate("/profile-page");
  //   } catch (err: any) {
  //     console.log(err);
  //     setError(err.message);
  //   }
  // };

  const mintNFT = async () => {
    if (address !== "0x765EEE6422215cdeb22071Dd21d569cbeC4eAe6a") {
      toast(
        "You dont have permission to mint, you can buy and then list the NFT",
        {
          style: {
            background: "#04111d",
            color: "#fff",
          },
        }
      );
    } else {
      if (!contract || !address) return;
      if (!file) {
        // alert("Please select an image");
        toast("Please select an Image", {
          style: {
            background: "#04111d",
            color: "#fff",
          },
        });
        return;
      }
      const metadata = {
        walletAddres: address,
        name,
        description,
        // price,
        image: file,
        category,
        date: new Date().toString(),
      };
      console.log("metadata -> ", metadata);
      try {
        const transaction = await contract.mintTo(address, metadata);
        const receipt = transaction.receipt;
        const tokenId = transaction.id;
        const nft = await transaction.data();
        console.log("Success-> ", receipt, tokenId, nft);
        navigate("/listing");
        toast.success("NFT Minted Successfully!", {
          style: {
            background: "#04111d",
            color: "#fff",
          },
        });
      } catch (error) {
        console.log(error);
        toast.error("Error occured, Please try again", {
          style: {
            background: "#04111d",
            color: "#fff",
          },
        });
      }
    }
  };
  // toast.promise(mintNFT, {
  //   loading: "Loading..",
  //   success: "NFT Minted Successfully!",
  //   error: "Error something went wrong, Please try again",
  // });
  // const mintNftToast = (toastHandler = toast) => {
  //   toastHandler.success("NFT Minted Successfully!", {
  //     style: {
  //       background: "#04111d",
  //       color: "#fff",
  //     },
  //   });
  // };
  const handleClear = () => {
    setName("");
    setDescription("");
    setFile("");
    setUploadedFile("");
    setPrice("");
    setImageURL("");
  };
  // const create

  // function submitFile(){}

  const fileTypes = ["PNG", "GIF", "WEBP", "MP3", "Max1GB"];
  return (
    <>
      <Container>
        <Toaster position="top-center" reverseOrder={false} />
        <Grid container spacing={10} className="marginChange">
          <Grid item sm={11} xs={12} md={8} className="adjustingPadding">
            <Box sx={styleDirection} className="columnStyle">
              <Box>
                <Typography variant="h4">
                  {props.tittle ? props.tittle : "Mint an NFT"}
                </Typography>
              </Box>
              {/* <Box>
                <Link to={props.link ? props.link : "/multiple-collectible"}>
                  <ButtonComponent
                    btnColor={"#23262F"}
                    styleType={"outline"}
                    classNames="btnStyle1 switchStyleP"
                  >
                    Switch to {props.switch ? props.switch : "mutiple"}
                  </ButtonComponent>
                </Link>
              </Box> */}
            </Box>
            <Box sx={styleCol}>
              <Typography variant="p" className="changeFont">
                Upload file
              </Typography>
              <Typography variant="p" className="font1">
                Drag or choose your file to upload
              </Typography>
              {/* <FileUploader
                handleChange={(e: any) => {
                  if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setFile(e.target.files[0]);
                    console.log("URL -> ", preview);
                  }
                }}
                name="file"
                types={fileTypes}
                setImage={setFile}
              /> */}
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setFile(e.target.files[0]);
                    console.log("file -> ", e.target.files[0]);
                    console.log("URL --> ", preview);
                  }
                }}
              />
            </Box>
            <Box>
              <p>Item details</p>
              <Textfield
                setName={setName}
                setDescription={setDescription}
                setCategory={setCategory}
                setCollections={setCollections}
                setPrice={setPrice}
              />
            </Box>
            <ButtonComponent
              customStyle={{
                display: "flex",
                alignItem: "center",
                marginTop: "20px",
              }}
              handleClick={mintNFT}
              btnColor={"#3772FF"}
              classNames="btnStyle1 width300 widthP"
            >
              MINT NFT
            </ButtonComponent>
            {/* <Box sx={styleDirection} className="paddingChange">
              <Box sx={styleCol}>
                <Typography variant="p" className="changeFont">
                  Put on sale
                </Typography>
                <Typography variant="p" className="font1">
                  You’ll receive bids on this item
                </Typography>
              </Box>
              <Box>
                <AntSwitch
                  defaultChecked
                  inputProps={{ "aria-label": "ant design" }}
                />
              </Box>
            </Box> */}
            {/* <Box sx={styleDirection} className="paddingChange">
              <Box sx={styleCol}>
                <Typography variant="p" className="changeFont">
                  Instant sale price
                </Typography>
                <Typography variant="p" className="font1">
                  Enter the price for which the item will be instantly sold
                </Typography>
              </Box>
              <Box>
                <AntSwitch inputProps={{ "aria-label": "ant design" }} />
              </Box>
            </Box>
            <Box sx={styleDirection} className="paddingChange">
              <Box sx={styleCol}>
                <Typography variant="p" className="changeFont">
                  Unlock once purchased
                </Typography>
                <Typography variant="p" className="font1">
                  Content will be unlocked after successful transaction
                </Typography>
              </Box>
              <Box>
                <AntSwitch inputProps={{ "aria-label": "ant design" }} />
              </Box>
            </Box>
            <Box sx={styleDirection} className="paddingChange">
              <Box sx={styleCol}>
                <Typography variant="p" className="changeFont">
                  Choose collection
                </Typography>
                <Typography variant="p" className="font1">
                  Choose an exiting collection or create a new one
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item sm={3} xs={6} md={3}>
                <Box sx={styleCol} className="bgColor">
                  <img
                    src={Picture ? rod1 : plus4}
                    className="imFluid"
                    onMouseOver={changeBackground}
                    onMouseLeave={changeBackgroundOut}
                  />
                  <Typography variant="p">Create collection</Typography>
                </Box>
              </Grid>
              <Grid item sm={3} xs={6} md={3}>
                <Box sx={styleCol} className="bgColor">
                  <img
                    src={Picture1 ? rod2 : plus3}
                    className="imFluid"
                    onMouseOver={changeBackground1}
                    onMouseLeave={changeBackgroundOut1}
                  />
                  <Typography variant="p">Crypto Legend - Professor</Typography>
                </Box>
              </Grid>
              <Grid item sm={3} xs={6} md={3}>
                <Box sx={styleCol} className="bgColor">
                  <img
                    src={Picture2 ? rod3 : plus2}
                    className="imFluid"
                    onMouseOver={changeBackground2}
                    onMouseLeave={changeBackgroundOut2}
                  />
                  <Typography variant="p">Crypto Legend - Professor</Typography>
                </Box>
              </Grid>
              <Grid item sm={3} xs={6} md={3}>
                <Box sx={styleCol} className="bgColor">
                  <img
                    src={Picture3 ? rod4 : plus1}
                    className="imFluid"
                    onMouseOver={changeBackground3}
                    onMouseLeave={changeBackgroundOut3}
                  />
                  <Typography variant="p">Legend Photography</Typography>
                </Box>
              </Grid>
            </Grid> */}
            {error && <Grid style={{ color: "red" }}>{error}</Grid>}
            <Box sx={styleDirection} className="paddingChange">
              <Box
                sx={{ display: "flex", flexDirection: "row" }}
                className="padding300"
              >
                <PreviewModal
                  name={name}
                  description={description}
                  price={price}
                  image={preview}
                  handleClear={handleClear}
                />

                {displayFollowSteps && (
                  <FollowStep
                    uploadToIPFS={sendFileToIPFS}
                    createNFT={mintNFT}
                    viewItem={true}
                    error={error}
                    reset={changeDisplayFollowSteps}
                  />
                )}
              </Box>
              <Box>
                {/* <Typography variant="p">
                  Auto Saving <img className="marginR" src={buffer} />
                </Typography> */}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{ display: { md: "flex", sm: "none", xs: "none" } }}
              className="changePadding"
            >
              <Typography variant="p" className="font2">
                Preview
              </Typography>
              <Card
                style={{
                  boxShadow: "none",
                  width: "250px",
                }}
                className="cardmedia1"
              >
                <Box className="boxwrap">
                  <CardMedia
                    component="img"
                    // image={uploadedFile ? uploadedFile : img1}
                    image={preview ? preview : placeholderImage}
                    // image={img1}
                    alt="green iguana"
                    className="cardmedia"
                  />
                </Box>
                <Box>
                  <Button variant="contained" className="mybutton">
                    Place a bid{" "}
                    <img src={bidIcon} alt="icon" className="bigiImg" />
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "7px",
                  }}
                  className="heartPurchase"
                >
                  <Box>
                    <Typography className="purchase">PURCHASING !</Typography>
                  </Box>
                  <Box>
                    {pressed ? (
                      <FavoriteIcon
                        className="heart"
                        onClick={pressing}
                        style={{ color: "#EF466F" }}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        className="heart"
                        onClick={pressing}
                      />
                    )}
                  </Box>
                </Box>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "5px",
                  }}
                >
                  <Box>
                    <Typography variant="h6" color="black">
                      {/* Sally Fadel */}
                      {name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" className="greenText">
                      {/* 161 ETH */}
                      {price} ETH
                    </Typography>
                  </Box>
                </CardContent>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "13px 0px",
                  }}
                >
                  {/* <img src={creator} alt="" /> */}

                  <Typography variant="caption" className="inStock">
                    1 in stock
                  </Typography>
                </CardContent>
                <Divider textAlign="right" orientation="horizontal"></Divider>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: "13px 0px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={candleStick}
                      alt="{creatorImg}"
                      style={{ marginRight: "5px" }}
                    />
                    <Typography variant="caption" className="bid">
                      Price <span className="eth">{price} ETH</span>
                      {/* Highest bid <span className="eth">220 ETH</span> */}
                    </Typography>
                  </Box>

                  <Typography variant="caption" className="newBid">
                    {/* New Bid */}
                  </Typography>
                </CardContent>
                <Box
                  className="hoverOnclick"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onClick={handleClear}
                >
                  <CancelTwoToneIcon></CancelTwoToneIcon>
                  <Typography className="mRight">Clear all</Typography>
                </Box>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
