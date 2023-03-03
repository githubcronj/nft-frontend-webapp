import {
  useState,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useCallback,
} from "react";
import "./ProfilePage.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import coverDemoImg from "../../Assets/images/bg_CoverImg.png";
import { UsersCard } from "../../Components/UsersCard/UsersCard";
import Upload_Icon from "../../Assets/images/Upload_Icon.svg";
// import {
//   FollowersCard,
//   FollowingCard,
// } from "../../Components/FollowersCard/FollowersCard";
import iconStar from "../../Assets/images/icons-Star-Filled-Copy.png";
import iconEdit from "../../Assets/images/icons-Edit-Line.png";
// import Data from "../../DB/BidCard/BidcardArray";
import Bidcard from "../../Components/Bidcard/Bidcard";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  listedProfileNFT,
  ownedProfileNFT,
} from "../../redux/slices/ProfileSlice";
import Spinner from "../../Spinner/Spinner";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { setAddress } from "../../redux/slices/UserSlice";
import { CradCollection } from "../../Components/CardCollection/CradCollection";
import { apiClient } from "../../axios/instance";
import { setUserCollection } from "../../redux/slices/CollectinSlice";
import ProfileCollection from "../../Components/ProfileCollection/ProfileCollection";
import toast, { Toaster } from "react-hot-toast";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "../../constants/Constants";
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
          <Grid>{children}</Grid>
        </Box>
      )}
    </div>
  );
}

const styles = {
  paperContainer: {
    backgroundImage: `url(${coverDemoImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  paperContainerUpload: {
    backgroundImage: `url(${coverDemoImg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    padding: "10px",
  },
};
function allyProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function ProfilePage() {
  const { fetchNFTs, fetchhMyNFTsOrListedNFTs, currentAccount } = useContext(
    NFTMarketplaceContext
  );
  const { contract: collectionContract, isLoading: collectionLoading } =
    useContract(NFT_COLLECTION_ADDRESS, "nft-collection");
  const address = useAddress();
  const nftList = useAppSelector((state) => state.profileData?.listedNFT);
  const ownedNFT = useAppSelector((state) => state.profileData?.ownedNFT);
  const ownedNFTThirdWeb = useOwnedNFTs(collectionContract, address);
  const [value, setvalue] = useState(0);
  const [uploadImage, setUploadImage] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [nftList, setNftList] = useState<any[]>();
  // const [ownedNFT, setOwnedNFT] = useState<any[]>();
  const [error, setError] = useState(false);
  // const [selectedNFT, setSelectedNFT] = useState<NFT>();
  const [showListedNFT, setShowListedNFT] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const dispatch = useAppDispatch();
  const handleUploadImage = () => {
    setUploadImage(!uploadImage);
  };
  const { account } = useWeb3React<Web3Provider>();
  const navigate = useNavigate();

  const handleChange = (event: any, newValue: SetStateAction<number>) => {
    setvalue(newValue);
  };
  const [collections, setCollections] = useState<any>([]);
  console.log("collection check -> ", collections);
  // useEffect(() => {
  //   fetchhMyNFTsOrListedNFTs("fetchItemsListed").then((items: any) => {
  //     setNfts(items);
  //   });
  // }, []);
  // useEffect(() => {
  //   fetchhMyNFTsOrListedNFTs("fetchMyListed").then((items: any) => {
  //     setMyNfts(items);
  //   });
  // }, []);

  useEffect(() => {
    setError(false);
    setLoading(true);
    const getNFTs = async () => {
      // const items = await fetchNFTs();
      const items = await fetchhMyNFTsOrListedNFTs("fetchItemsListed");
      if (items === undefined) {
        setError(true);
      } else {
        console.log(items);
        // setNftList(items);
        dispatch(listedProfileNFT(items));
      }
      setLoading(false);
    };

    getNFTs();
  }, [refresh]);

  useEffect(() => {
    setError(false);
    setLoading(true);
    const getListedNFTs = async () => {
      const items = await fetchhMyNFTsOrListedNFTs("fetchMyNFT");
      if (items === undefined) {
        setError(true);
      } else {
        console.log(items);
        // setOwnedNFT(items);
        dispatch(ownedProfileNFT(items));
      }
      setLoading(false);
    };
    getListedNFTs();
  }, []);

  const loadingSpinner = () => {
    if (loading) {
      return (
        <div style={{ height: "70vh" }}>
          <Spinner message="Fetching the Latest & Updated data for you, please wait..." />
        </div>
      );
    }
  };
  const fetchCollectionName = async () => {
    try {
      const result = await apiClient.get(`/collection/${account}`);
      console.log("Collection Name Check -> ", result.data.data);
      const collectionList = result?.data?.data.map(
        (itemCollection: any[]) => itemCollection[0]
      );
      dispatch(setUserCollection([...collectionList]));
      setCollections([...collectionList]);
    } catch (err: any) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCollectionName();
  }, [account]);

  // const profileUpdated = (toastHandler = toast) => {
  //   toastHandler.success("Profile Updated Successfully!", {
  //     style: {
  //       background: "#04111d",
  //       color: "#fff",
  //     },
  //   });
  // };

  return (
    <Grid>
      {uploadImage ? (
        <Grid style={styles.paperContainerUpload} className="paper_height">
          <Grid className="dashedBorderGrid">
            <Grid className="upload_Grid" component="label">
              <input type="file" hidden />
              <Box>
                <img
                  src={Upload_Icon}
                  alt="uploadIcon"
                  className="Upload_Icon_style"
                />
                <Typography className="DragAndDropText">
                  Drag and drop your photo here
                </Typography>
                <Typography className="Browsetext">
                  or click to browse
                </Typography>
              </Box>
            </Grid>
            <Grid className="SavePhotoBtn_grid">
              <ButtonComponent
                handleClick={handleUploadImage}
                btnColor={"#3772FF"}
                classNames="savePhoto_btn"
              >
                Save Photo
              </ButtonComponent>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Paper style={styles.paperContainer} className="paper_height">
          <Box className="button_div">
            <Button
              onClick={handleUploadImage}
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                color: "#fff",
                padding: "7px 12px",
                margin: "12px",
                fontSize: "12px",
                boxShadow: " 0 0 0 2px #777e90 inset",
              }}
            >
              Edit cover photo
              <span>
                <img
                  src={iconStar}
                  style={{ width: "12px", marginLeft: "8px" }}
                />
              </span>
            </Button>
            <Link to="/edit-profile-page" className="linkUnderline">
              <Button
                sx={{
                  textTransform: "none",
                  borderRadius: "20px",
                  color: "#fff",
                  padding: "7px 12px",
                  margin: "12px",
                  fontSize: "12px",
                  boxShadow: " 0 0 0 2px #777e90 inset",
                }}
              >
                Edit profile
                <span>
                  <img
                    src={iconEdit}
                    style={{ width: "12px", marginLeft: "8px" }}
                  />
                </span>
              </Button>
            </Link>
          </Box>
        </Paper>
      )}

      <Grid container spacing={2} className="outerGrid_style">
        <Grid className="usercardGrid_Styling">
          <UsersCard />
        </Grid>
        <Grid className="navpill_Styling">
          <Grid className="tabTopGrid_Styling">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              className="tabs_Styling"
            >
              <Tab
                label="Your Listings"
                {...allyProps(0)}
                sx={{ textTransform: "none", color: "#777E90" }}
              />
              {/* <Tab
                label="Listed"
                {...allyProps(1)}
                sx={{ textTransform: "none", color: "#777E90" }}
              />
              <Tab
                label="Owned"
                {...allyProps(2)}
                sx={{ textTransform: "none", color: "#777E90" }}
              />
              <Tab
                label="My Collections"
                {...allyProps(3)}
                sx={{ textTransform: "none", color: "#777E90" }}
              /> */}
              {/* <Tab
                label="Following"
                {...allyProps(4)}
                sx={{ textTransform: "none", color: "#777E90" }}
              />
              <Tab
                label="Followers"
                {...allyProps(5)}
                sx={{ textTransform: "none", color: "#777E90" }}
              /> */}
            </Tabs>

            <TabPanel value={value} index={0}>
              <Grid className="tabPanelSection-Style">
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "0px",
                    justifyContent: "space-evenly",
                  }}
                >
                  {collectionLoading ? (
                    "Loading ..."
                  ) : !ownedNFTThirdWeb?.data?.length ||
                    ownedNFTThirdWeb?.data?.length === undefined ? (
                    <Box sx={{ alignItems: "center" }}>
                      <Typography> No Data Found</Typography>
                    </Box>
                  ) : (
                    ownedNFTThirdWeb?.data?.map((nft) => (
                      <>
                        <Card
                          sx={{
                            width: 245,
                            // border:
                            //   selectedNFT?.metadata.id === nft?.metadata.id
                            //     ? "1px solid black"
                            //     : null,
                          }}
                          onClick={() => navigate("/listing")}
                          key={nft.metadata.id}
                        >
                          <CardActionArea>
                            <MediaRenderer
                              className="cardmedia"
                              style={{ width: "245px", height: "300px" }}
                              src={nft.metadata.image}
                            />
                            <CardContent>
                              <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                              >
                                {nft.metadata.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {nft.metadata.description}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </>
                    ))
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid className="tabPanelSection-Style">
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "0px",
                    justifyContent: "space-evenly",
                  }}
                >
                  {/* {Data.filter(function (cardData) {
                    return cardData.id <= 4;
                  }).map((item, index) => (
                    <Bidcard cardData={item} key={item.id} />
                  ))} */}
                  {error === true ? (
                    <Button
                      onClick={() => {
                        setRefresh(refresh + 1);
                      }}
                    >
                      {" "}
                      Refresh{" "}
                    </Button>
                  ) : !loading ? (
                    nftList.length ? (
                      nftList.map((item, index) => (
                        <Bidcard
                          cardData={item}
                          key={item.tokenId}
                          whiteCard={true}
                          values={value}
                        />
                      ))
                    ) : (
                      <h3>No Data Found</h3>
                    )
                  ) : (
                    loadingSpinner()
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Grid className="tabPanelSection-Style">
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "0px",
                    justifyContent: "space-evenly",
                  }}
                >
                  {/* {Data.filter(function (cardData) {
                    return cardData.id <= 2;
                  }).map((item, index) => (
                    <Bidcard cardData={item} key={item.id} />
                  ))} */}
                  {error === true ? (
                    <Button
                      onClick={() => {
                        setRefresh(refresh + 1);
                      }}
                    >
                      {" "}
                      Refresh{" "}
                    </Button>
                  ) : !loading ? (
                    ownedNFT.length ? (
                      ownedNFT.map((item, index) => (
                        <Bidcard
                          cardData={item}
                          key={item.tokenId}
                          whiteCard={true}
                          type="owned"
                          values={value}
                        />
                      ))
                    ) : (
                      <h3>No Data Found</h3>
                    )
                  ) : (
                    loadingSpinner()
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Grid className="tabPanelSection-Style">
                <Grid
                  container
                  spacing={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginLeft: "0px",
                    textAlign: "center",
                  }}
                >
                  {/* <CradCollection type="profile" /> */}
                  {collections.map((item: any) => (
                    <Grid item sm={6} md={4}>
                      <ProfileCollection cardData={item} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </TabPanel>
            {/* <TabPanel value={value} index={4}>
              <Grid className="tabPanelSection2-Style">
                <FollowingCard />
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={5}>
              <Grid className="tabPanelSection2-Style">
                <FollowersCard />
              </Grid>
            </TabPanel> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
