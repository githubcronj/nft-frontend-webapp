import {
  useState,
  ReactNode,
  SetStateAction,
  useEffect,
  useContext,
} from "react";
import "./Item.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IosShareIcon from "@mui/icons-material/IosShare";
import TextField from "@mui/material/TextField";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useAppSelector } from "../../redux/hooks";
import Spinner from "../../Spinner/Spinner";

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

const ItemProfileOwned = () => {
  const { createSale } = useContext(NFTMarketplaceContext);
  const [convertedPrice, setConvertedPrice] = useState<any>();
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [value, setvalue] = useState(0);
  const [search, setSearch] = useState(true);
  const [pink, setPink] = useState(false);
  const [dotPopup, setDotPopup] = useState(false);
  const [sharePopup, setSharePopup] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tokenId = searchParams.get("id") || "";
  const tokenURI = searchParams.get("tokenURI") || "";
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const cardData = useAppSelector((state) => state.nftsData.selectedNft);

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

  // useEffect(() => {
  //   setError("");
  //   setLoading(true);
  //   axios
  //     .get(tokenURI)
  //     .then((res) => {
  //       const data = res.data;
  //       console.log(data);
  //       // setCardData(data);
  //       setLoading(false);
  //     })
  //     .catch((err: any) => {
  //       setLoading(false);
  //       console.log(err);
  //       setError(err.message);
  //     });
  // }, []);

  useEffect(() => {
    if (!cardData) {
      navigate(-1);
    }
  }, []);

  // RESELL STARTS HERE
  // const fetchNFT = async () => {
  //   if (!tokenURI) return;

  //   const { data } = await axios.get(tokenURI);
  //   // setPrice(data.price);
  //   setImage(data.image);
  // };
  // useEffect(() => {
  //   fetchNFT();
  // }, [tokenId]);
  const loadingSpinner = () => {
    if (loading) {
      return (
        <div style={{ height: "70vh" }}>
          <Spinner message="Loading, Please wait" />
        </div>
      );
    }
  };
  const reSell = async () => {
    try {
      setLoading(true);
      await createSale(cardData.tokenURI, price, true, cardData.tokenId);
      setLoading(false);
      navigate("/profile-page");
    } catch (error) {
      console.log("Error in Resell -> ", error);
    }
  };

  const fetchMarketPrice = async () => {
    try {
      const result = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR`
      );
      // console.log("USD PRICE CHECK  -> ", result.data.USD);
      setConvertedPrice(result.data.USD);
      // dispatch(setUserCollection(result?.data?.data));
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchMarketPrice();
  }, []);
  return (
    <Container>
      {!loading ? (
        <>
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
                    src={cardData.image || headImg}
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
                    {cardData?.category ? cardData?.category : "Category"}
                  </Typography>
                  <Typography
                    textTransform="capitalize"
                    variant="subtitle2"
                    component="span"
                    className="unlock"
                  >
                    {cardData?.collections
                      ? cardData?.collections
                      : "Collections"}
                  </Typography>
                </Box>
                {sharePopup ? (
                  <Box className="dotsPopup">
                    <Box sx={{ marginBottom: "15px" }}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        component="div"
                      >
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
                </Box>
              </Grid>
              <Grid item xs={12} xl={4} md={4} lg={4} sm={12}>
                <Box className="rightDiv">
                  <Typography variant="h3" gutterBottom component="div">
                    {/* The amazing art */}
                    {cardData.name}
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
                      {cardData.price} ETH
                    </Typography>
                  </Box>
                  <Box sx={{ marginRight: "5px" }}>
                    <Typography
                      variant="caption"
                      display="span"
                      className="dollar"
                    >
                      {/* $4,429.87 */}
                      {(cardData.price * convertedPrice).toFixed(6)} USD
                    </Typography>
                  </Box>
                  <Box sx={{ marginRight: "5px" }}>
                    <Typography
                      variant="caption"
                      display="span"
                      className="inStock"
                    >
                      10 in stock
                    </Typography>
                  </Box>
                </Box>
                <Box className="rightDiv">
                  <Typography
                    variant="caption"
                    display="block"
                    className="linkText"
                  >
                    This NFT Card will give you Access to Special Airdrops. To
                    learn more about please visit
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
                        <Tab
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
                        />
                        <Tab
                          label="Offers"
                          {...allyProps(3)}
                          sx={{ textTransform: "none", color: "#777E90" }}
                        />
                      </Tabs>
                      {/* <TabPanel value={value} index={0}>
                        {Info.map((item) => (
                          <ItemNavPill
                            cardData={cardData}
                            itemsDetails={item}
                            key={item.id}
                          />
                        ))}
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        {Owners.map((item) => (
                          <ItemNavPill
                            cardData={cardData}
                            itemsDetails={item}
                            key={item.id}
                          />
                        ))}
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        {History.map((item) => (
                          <ItemNavPill
                            cardData={cardData}
                            itemsDetails={item}
                            key={item.id}
                          />
                        ))}
                      </TabPanel>
                      <TabPanel value={value} index={3}>
                        {Bids.map((item) => (
                          <ItemNavPill
                            cardData={cardData}
                            itemsDetails={item}
                            key={item.id}
                          />
                        ))}
                      </TabPanel> */}
                    </Grid>
                  </Grid>
                </Box>

                <Box>
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
                      <Box>
                        <Typography
                          fontWeight="bold"
                          sx={{ marginBottom: "15px" }}
                        >
                          Resell :
                        </Typography>
                        <TextField
                          onChange={(e) => {
                            setPrice(e.target.value);
                          }}
                          id="outlined-basic"
                          label="Resell Price"
                          variant="outlined"
                        />
                      </Box>
                      <ButtonComponent
                        customStyle={{
                          backgroundColor: "blue",
                          marginTop: "25px",
                          padding: "15px",
                        }}
                        buttonType="submit"
                        handleClick={() => {
                          reSell();
                        }}
                      >
                        RESELL
                      </ButtonComponent>
                      <ButtonComponent
                        customStyle={{
                          backgroundColor: "#FF0000",
                          marginTop: "25px",
                          marginLeft: "10px",
                          padding: "15px",
                        }}
                        buttonType="submit"
                        handleClick={() => {
                          navigate("/profile-page");
                        }}
                      >
                        CANCEL
                      </ButtonComponent>
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
                  </Box>
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
                        <DilogueBox nft={{ ...cardData, tokenId }} />
                        <PlaceaBidModals />
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
                      1.5%
                    </Typography>

                    <Typography
                      variant="body2"
                      component="span"
                      className="cardBottom"
                    >
                      2.563 ETH
                    </Typography>

                    <Typography
                      variant="body2"
                      component="span"
                      className="cardBottom"
                    >
                      $4,540.62
                    </Typography>
                  </Box> */}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        loadingSpinner()
      )}
    </Container>
  );
};

export default ItemProfileOwned;
