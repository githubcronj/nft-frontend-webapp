import { useState, ReactNode, SetStateAction, useEffect } from "react";
import "./Item.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IosShareIcon from "@mui/icons-material/IosShare";
import {
  Grid,
  Container,
  Divider,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";
import headImg from "../../Assets/images/itemImg.png";

import creatorProfile from "../../Assets/images/ProfileImage.jpg";
import dollar from "../../Assets/images/dollar.svg";
import report from "../../Assets/images/report.svg";
import right from "../../Assets/images/itemRight.svg";
import tweet from "../../Assets/images/twitter.svg";
import cross from "../../Assets/images/itemCross.svg";
import fb from "../../Assets/images/fb.svg";
import ItemNavPill from "../ItemNavPill/ItemNavPill";
import { Info, History, Bids, Owners } from "../../DB/ItemsPage/ItemArray";
import Remove from "../Modals/Remove/Remove";
import BurnToken from "../Modals/BurnToken/BurnToken";
import Report from "../Modals/Report/Report";
import Transfer from "../Modals/Transfer/Transfer";
import PlaceaBidModals from "../Modals/PlaceaBidModal/PlaceaBidModals";
import DilogueBox from "../Modals/DilogueBox/DilogueBox";
import ChangePrice from "../Modals/ChangePrice/ChangePrice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "../../redux/hooks";
import { NFT_MARKETPLACE_ADDRESS } from "../../constants/Constants";
import {
  useContract,
  useListing,
  useNetwork,
  useNetworkMismatch,
  useOffers,
  useMakeOffer,
  useBuyNow,
  useAddress,
  useAcceptDirectListingOffer,
} from "@thirdweb-dev/react";
import netowork from "../../utils/netowork";
import Spinner from "../../Spinner/Spinner";
import toast, { Toaster } from "react-hot-toast";
import Countdown from "react-countdown";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function allyProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Item = () => {
  const cardData = useAppSelector((state: any) => state.nftsData.selectedNft);
  // const listingId = cardData.id;
  const listingId = cardData?.id;
  // const listingIdForOffer = cardData.id;
  const { contract } = useContract(NFT_MARKETPLACE_ADDRESS, "marketplace");
  const [value, setvalue] = useState(0);
  const [search, setSearch] = useState(true);
  const [pink, setPink] = useState(false);
  const [dotPopup, setDotPopup] = useState(false);
  const [sharePopup, setSharePopup] = useState(false);

  //here we have used listing ID in offer
  const offers = useOffers(contract, cardData?.id);
  const offersListing = offers.data;
  const [minimumNextBid, setMinimumNextBid] = useState<{
    display: string;
    symbol: string;
  }>();
  // console.log("MY OFFERS --> ", offers);
  // const [searchParams, setSearchParams]= useSearchParams()
  // const tokenId= searchParams.get('id') || "";
  // const tokenURI= searchParams.get('tokenURI') || '';
  //filter test starts here -----------------
  const ifListed = useAppSelector((state: any) => state.profileData.listedNFT);
  console.log("selected NFt -> ", cardData.asset.id);
  // console.log("ifListed --> ", ifListed);
  // console.log("Filtered NFt -> ", ifListed.includes(cardData));
  //-------------------------------------------------------------
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [convertedPrice, setConvertedPrice] = useState<any>();
  const [inr, setInr] = useState();
  const navigate = useNavigate();
  const USD = (
    cardData?.buyoutCurrencyValuePerToken?.displayValue * convertedPrice
  ).toFixed(4);
  const opendotPopup = () => {
    setDotPopup(!dotPopup);
    setSharePopup(false);
  };
  const openSharePopup = () => {
    setDotPopup(false);
    setSharePopup(!sharePopup);
  };

  const chnagePink = () => {
    setPink(!pink);
    setDotPopup(false);
    setSharePopup(false);
  };

  const chnageSearch = () => {
    setSearch(false);
  };

  const handleChange = (event: any, newValue: SetStateAction<number>) => {
    setvalue(newValue);
  };

  useEffect(() => {
    if (!cardData) {
      navigate(-1);
    }
  }, []);
  const fetchMarketPrice = async () => {
    try {
      const result = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR`
      );
      // console.log("USD PRICE CHECK  -> ", result.data.data.rates.USD);
      setConvertedPrice(result.data.USD);
    } catch (err: any) {
      console.log(err);
    }
  };
  const fetchUSDToINR = async () => {
    try {
      const result = await axios.get(
        `http://api.exchangeratesapi.io/v1/latest?access_key=dda44a510d8b21442bca6f4d7800b655&format=1?base=${USD}&symbols=INR`
      );
      console.log("INR PRICE CHECK  -> ", result.data.rates.INR);
      setInr(result.data.rates.INR);
      // dispatch(setUserCollection(result?.data?.data));
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMarketPrice();
    fetchUSDToINR();
  }, []);
  const [, switchNetwork] = useNetwork();
  const networkMismatch = useNetworkMismatch();
  const {
    mutate: buyNow,
    isLoading: isBuyNowLoading,
    error: isBuyNowError,
  } = useBuyNow(contract);

  const buyNFT = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(netowork);
      return;
    }
    await buyNow(
      {
        id: listingId,
        buyAmount: 1,
        type: cardData.type,
      },
      {
        onSuccess(data, variables, context) {
          console.log("SUCCESS : ", data, variables, context);
          // alert("NFT Bought Successfully");
          toast.success("NFT Bought Successfully", {
            style: {
              background: "#04111d",
              color: "#fff",
            },
          });
          navigate("/home");
        },
        onError(error, variables, context) {
          console.log("ERROR : ", error, variables, context);
          // alert("NFT could not be bought");
          toast.error("Error occured, please try again", {
            style: {
              background: "#04111d",
              color: "#fff",
            },
          });
          navigate("/home");
        },
      }
    );
  };
  const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract);
  // console.log("CARD DATA --> ", cardData);
  const listindIdForAuction = cardData?.id;
  useEffect(() => {
    if (!listindIdForAuction || !contract || !cardData) return;

    if (cardData?.type === 1) {
      fetchMinNextBid();
    }
  }, [listindIdForAuction, cardData, contract]);

  console.log("Min NExt Bid --> ", minimumNextBid);
  const [auctionPriceLoading, setAuctionPriceLoading] = useState(false);

  const fetchMinNextBid = async () => {
    if (!listingId || !contract) return;
    setAuctionPriceLoading(true);
    const minBidResponse = await contract.auction.getMinimumNextBid(
      listindIdForAuction
    );
    // console.log("RESPONSE from Min Bid Res -> ", minBidResponse);
    setMinimumNextBid({
      //check this if error comes , change displayVal to display , ctrl + space
      display: minBidResponse.displayValue,
      symbol: minBidResponse.symbol,
    });
    setAuctionPriceLoading(false);
  };

  // const acceptOfferHandler = async (offer: Record<string, any>) => {};
  return (
    <>
      <Container>
        <Toaster position="top-center" reverseOrder={false} />
        {!cardData ? (
          <h4>Loading...</h4>
        ) : (
          <Grid container sx={{ margin: "50px 0px" }}>
            <Grid
              item
              xs={12}
              xl={7}
              md={7}
              lg={7}
              sm={12}
              className="relativeDiv"
            >
              <Box className="itemImage">
                <img
                  src={cardData?.asset?.image || headImg}
                  alt="bidImage"
                  style={{ width: "95%", height: "100%" }}
                />
              </Box>
              <Box className="artWrapper">
                <Typography
                  textTransform="capitalize"
                  variant="subtitle2"
                  component="span"
                  className="art"
                >
                  {cardData?.asset?.category
                    ? cardData?.asset?.category
                    : "Category"}
                </Typography>
                <Typography
                  textTransform="capitalize"
                  variant="subtitle2"
                  component="span"
                  className="unlock"
                >
                  {cardData?.asset?.collections
                    ? cardData?.asset?.collections
                    : "Collections"}
                </Typography>
              </Box>
              {/* {sharePopup ? (
              <Box className="dotsPopup">
                <Box sx={{ marginBottom: "15px" }}>
                  <Typography variant="subtitle2" gutterBottom component="div">
                    Share link to this page
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    marginBottom: "10px",
                  }}
                >
                  <Box>
                    <img src={tweet} alt="" className="sharepopupIcon" />
                  </Box>

                  <Box sx={{ marginLeft: "10px" }}>
                    <img src={fb} alt="" className="sharepopupIcon" />
                  </Box>
                </Box>
              </Box>
            ) : null}
            {dotPopup ? (
              <Box className="dotsPopup">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  className="hoverPink"
                >
                  <Box>
                    <img src={dollar} alt="" className="dotpopupIcon" />
                  </Box>
                  <Box>
                    <ChangePrice />
                  </Box>
                </Box>
                <Divider light sx={{ margin: "5px 0px" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  className="hoverPink"
                >
                  <Box>
                    <img src={right} alt="" className="dotpopupIcon" />
                  </Box>

                  <Transfer />
                </Box>
                <Divider light sx={{ margin: "5px 0px" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  className="hoverPink"
                >
                  <Box>
                    <img src={cross} alt="" className="dotpopupIcon" />
                  </Box>
                  <Box>
                    <Remove />
                  </Box>
                </Box>
                <Divider light sx={{ margin: "5px 0px" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  className="hoverPink"
                >
                  <Box>
                    <img src={cross} alt="" className="dotpopupIcon" />
                  </Box>
                  <Box>
                    <BurnToken />
                  </Box>
                </Box>
                <Divider light sx={{ margin: "5px 0px" }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  className="hoverPink"
                >
                  <Box>
                    <img src={report} alt="" className="dotpopupIcon" />
                  </Box>
                  <Box>
                    <Report />
                  </Box>
                </Box>
              </Box>
            ) : null}
            <Box className="popoverWrapper">
              <Box>
                <IosShareIcon
                  sx={{
                    borderRadius: "35px",
                    padding: "5px",
                    color: "#777e90",
                    width: "25px",
                    height: "25px",
                  }}
                  className="heartIocn"
                  onClick={openSharePopup}
                ></IosShareIcon>
              </Box>
              <Box>
                {pink ? (
                  <FavoriteBorderIcon
                    sx={{
                      borderRadius: "35px",
                      padding: "5px",
                      color: "#777e90",
                      width: "25px",
                      height: "25px",
                    }}
                    onClick={chnagePink}
                    className="heartIocn3"
                  ></FavoriteBorderIcon>
                ) : (
                  <FavoriteIcon
                    sx={{
                      borderRadius: "35px",
                      padding: "5px",

                      width: "25px",
                      height: "25px",
                      color: "#EF466F",
                    }}
                    onClick={chnagePink}
                    className="heartIocn2"
                  ></FavoriteIcon>
                )}
              </Box>
              <Box>
                <MoreHorizIcon
                  className="heartIocn"
                  sx={{
                    borderRadius: "35px",
                    padding: "5px",
                    color: "#777e90",
                    width: "25px",
                    height: "25px",
                  }}
                  onClick={opendotPopup}
                ></MoreHorizIcon>
              </Box>
            </Box> */}
            </Grid>
            <Grid item xs={12} xl={4} md={4} lg={4} sm={12}>
              <Box className="rightDiv">
                <Typography variant="h3" gutterBottom component="div">
                  {/* The amazing art */}
                  {cardData?.asset.name}
                </Typography>
              </Box>
              <Box
                className="rightDiv"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "25px",
                }}
              >
                <Box sx={{ marginRight: "5px" }}>
                  <Typography
                    variant="caption"
                    display="span"
                    className="greenEth"
                  >
                    {/* 3.5 ETH */}
                    {cardData.buyoutCurrencyValuePerToken.displayValue} ETH
                  </Typography>
                </Box>
                <Box sx={{ marginRight: "5px" }}>
                  <Typography
                    variant="caption"
                    display="span"
                    className="dollar"
                  >
                    {/* $4,429.87 D */}
                    {USD} USD
                  </Typography>
                </Box>
                {/* <Box sx={{ marginRight: "5px" }}>
                <Typography variant="caption" display="span" className="dollar">
                  {inr} INR
                </Typography>
              </Box> */}
                <Box sx={{ marginRight: "5px" }}>
                  <Typography
                    variant="caption"
                    display="span"
                    className="inStock"
                  >
                    1 in stock
                  </Typography>
                </Box>
              </Box>
              <Box className="rightDiv">
                <Typography
                  variant="caption"
                  display="block"
                  className="linkText"
                >
                  {/* This NFT Card will give you Access to Special Airdrops. To learn
                more about please visit */}
                  {cardData?.asset?.description
                    ? cardData?.asset.description
                    : "No Description Found"}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  className="link"
                >
                  <a href="">https://cronj.com</a>
                </Typography>
              </Box>
              <Box className="itemNavPills">
                <Grid className="navpill_Styling">
                  <Grid className="tabTopGrid_Styling">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      className="navpillStylingItem"
                    >
                      {/* <Tab
                      label="Info"
                      {...allyProps(0)}
                      sx={{ textTransform: "none", color: "#777E90" }}
                    />
                    <Tab
                      label="Owners"
                      {...allyProps(1)}
                      sx={{ textTransform: "none", color: "#777E90" }}
                    />
                    <Tab
                      label="History"
                      {...allyProps(2)}
                      sx={{ textTransform: "none", color: "#777E90" }}
                    /> */}
                      <Tab
                        label="Current Offers"
                        {...allyProps(0)}
                        sx={{ textTransform: "none", color: "#777E90" }}
                      />
                    </Tabs>
                    {/* <TabPanel value={value} index={0}>
                    {offersListing?.map((item) => (
                      <ItemNavPill
                        cardData={cardData}
                        itemsDetails={item}
                        key={item.id}
                      />
                    ))}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    {offersListing?.map((item) => (
                      <ItemNavPill
                        cardData={cardData}
                        itemsDetails={item}
                        key={item.id}
                      />
                    ))}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    {offersListing?.map((item) => (
                      <ItemNavPill
                        cardData={cardData}
                        itemsDetails={item}
                        key={item.id}
                      />
                    ))}
                  </TabPanel> */}
                    <Box className="scrollbarOffer">
                      <TabPanel value={value} index={0}>
                        {!offersListing ||
                        offersListing === undefined ||
                        offersListing.length === 0
                          ? "No Offers Made"
                          : offersListing?.map((item) => (
                              <ItemNavPill
                                cardData={cardData}
                                itemsDetails={item}
                                key={item.id}
                                acceptOffer={acceptOffer}
                                listingId={listingId}
                                contract={contract}
                              />
                            ))}
                      </TabPanel>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box>
                {ifListed.includes(cardData) ? null : (
                  <Card
                    className="itemCard"
                    sx={{
                      background: "#FCFCFD 0% 0% no-repeat padding-box",
                      boxShadow: "0px 64px 64px #1F2F461F",
                      borderRadius: "16px",
                      border: "1px solid #E6E8EC",
                      padding: "20px 0px",
                    }}
                  >
                    <CardContent>
                      {/* <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <img
                            src={creatorProfile}
                            alt=""
                            style={{ width: "50px" }}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            className="HighestBid"
                            component="span"
                          >
                            Highest bid by
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className="BidderName"
                            component="span"
                          >
                            Kohaku Tora
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              className="ETH"
                              component="span"
                            >
                              1.46 ETH
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              className="cardDollar"
                              component="span"
                            >
                              $2,764.89
                            </Typography>
                          </Box>
                        </Box>
                      </Box> */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          margin: "10px",
                        }}
                        className="buttonGroup"
                      >
                        {!error ? (
                          <>
                            <DilogueBox nft={{ ...cardData }} buyNFT={buyNFT} />
                            <PlaceaBidModals
                              listing={{ ...cardData }}
                              buyNFT={buyNFT}
                            />
                          </>
                        ) : (
                          <h5>{error}</h5>
                        )}
                      </Box>

                      <Box className="bottomCard">
                        <Typography
                          variant="body2"
                          component="span"
                          className="serviceFee"
                        >
                          Service fee
                        </Typography>

                        <Typography
                          variant="body2"
                          component="span"
                          className="percent"
                        >
                          0%
                        </Typography>
                        <Typography
                          variant="body2"
                          component="span"
                          className="serviceFee"
                        >
                          Price
                        </Typography>

                        <Typography
                          variant="body2"
                          component="span"
                          className="percent"
                        >
                          {cardData?.buyoutCurrencyValuePerToken?.displayValue}{" "}
                          ETH
                        </Typography>

                        <Typography
                          variant="body2"
                          component="span"
                          className="cardBottom"
                        >
                          {/* $4,540.62 */}
                        </Typography>
                      </Box>
                    </CardContent>
                    {/* Remaining time in auction */}

                    {cardData?.type === 1 && (
                      <>
                        <Box paddingLeft="25px">
                          <Box>
                            <Typography
                              variant="body2"
                              component="span"
                              className="cardBottom"
                            >
                              {" "}
                              Current Minimum Bid:{" "}
                            </Typography>
                            <Typography
                              variant="body2"
                              component="span"
                              className="percent"
                            >
                              {/* { 
                               minimumNextBid?.display === 0
                                ? "Enter Bid Amount"
                                : `${minimumNextBid?.display} ${minimumNextBid?.symbol} or more`} */}
                              {auctionPriceLoading ? (
                                "Loading..."
                              ) : (
                                <>
                                  {minimumNextBid?.display}
                                  {minimumNextBid?.symbol}
                                </>
                              )}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            component="span"
                            className="cardBottom"
                          >
                            {" "}
                            Time Remaining:{" "}
                          </Typography>
                          <Typography
                            variant="body2"
                            component="span"
                            className="percent"
                          >
                            <Countdown
                              date={
                                Number(
                                  cardData.endTimeInEpochSeconds.toString()
                                ) * 1000
                              }
                            />
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Card>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default Item;
