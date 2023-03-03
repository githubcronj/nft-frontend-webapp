import {
  useState,
  ReactNode,
  SetStateAction,
  useEffect,
  useContext,
  useCallback,
} from "react";
import "./SearchFilter.css";
import {
  Container,
  Box,
  Typography,
  Divider,
  Grid,
  Tabs,
  Tab,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import Dropdown from "../../Common/Dropdown/Dropdown";
import SliderComponent from "../Slider/Slider";
import reset from "../../Assets/images/resetFilter.svg";
import Data from "../../DB/BidCard/WhiteCardArray";
import Searchbar from "../../Common/Searchbar/Searchbar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Bidcard from "../Bidcard/Bidcard";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";
import toast, { Toaster } from "react-hot-toast";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setNfts, setSelectedNft } from "../../redux/slices/NFTs";
import Spinner from "../../Spinner/Spinner";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  useActiveListings,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import { NFT_MARKETPLACE_ADDRESS } from "../../constants/Constants";

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

interface cardProps {
  colData: {
    cardIt: {
      id: number;
      mainImg: string;
      artName: string;
      ETH: number;
      inStock: number;
      highestBid: number;
      bidtype: string;
      creatorList?: any;
    }[];
  };
}
function allyProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SearchFilter = () => {
  const { collection } = useParams();
  console.log("collection", collection);

  const { fetchNFTs, fetchhMyNFTsOrListedNFTs } = useContext(
    NFTMarketplaceContext
  );
  const { contract } = useContract(NFT_MARKETPLACE_ADDRESS, "marketplace");
  const address = useAddress();
  // console.log("Cotnract -> ", contract);
  const { data: listings, isLoading: isListingLoading } =
    useActiveListings(contract);
  const nftList = useAppSelector((state: any) => state.nftsData.nfts);
  // const nftListAsset = nftList.asset;
  const [filteredNfts, setFilteredNfts] = useState([...nftList]);
  const [displayAllCategoryNfts, setDisplayAllCategoryNfts] = useState([
    ...filteredNfts,
  ]);
  const [displaySpecificCategoryNfts, setDisplaySpecificCategoryNfts] =
    useState(displayAllCategoryNfts);

  //TESTING LOAD MORE----------------------
  const [isCompleted, setIsCompleted] = useState(false);
  // const initialPosts = slice(displaySpecificCategoryNfts, 0, index);
  const [index, setIndex] = useState(6);
  const loadMore = () => {
    setIndex(index + 6);
    // console.log("INDEX -> ", index);
    if (index >= displaySpecificCategoryNfts.length) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };
  //ENDS HERE--------------------------------------------
  const dispatch = useAppDispatch();
  const [nftCopy, setNftCopy] = useState([]);
  const arr = ["highest price", "average price", "lowest price"];
  const arr2 = ["first price", "second price", "lowest price"];
  const [value, setvalue] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [loadmore, setLoadmore] = useState(true);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<number>(0);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [date, setDate] = useState<number>(0);
  const [price, setPrice] = useState<string>("0");
  const [category, setCategory] = useState<string>("all");
  // const [loadMore, setLoadMore] = useState(false);
  const [extraCard, setExtraCard] = useState(false);
  const [page, setPage] = useState(1);
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
  const searchByName = (nftName: string) => {
    const arr = filterCategory(category);
    const modifiedArr = arr.filter((nft) => {
      const name = nft.name.toLowerCase();
      nftName = nftName.toLowerCase();
      if (name.includes(nftName)) return nft;
    });
    setDisplaySpecificCategoryNfts([...modifiedArr]);
  };

  const clearSearch = () => {
    applyCategory(category);
  };

  const applySearch = (value: string) => {
    setSearch(value);
    if (value) {
      searchByName(value);
    } else {
      clearSearch();
    }
  };

  const debounce = (callback: any, delay = 1000) => {
    let timer: any;
    return (args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(args);
      }, delay);
    };
  };

  const applySearchDebounce = debounce((value: any) => {
    applySearch(value);
  }, 1000);

  const filterDate = (value: any) => {
    let dateArray: any[] = [...displaySpecificCategoryNfts];
    console.log("Value --> ", value);
    setDate(value);
    dateArray.sort((a: any, b: any) => {
      if (value === 1) {
        return +new Date(a.date) - +new Date(b.date);
      } else {
        return +new Date(b.date) - +new Date(a.date);
      }
    });
    setDisplaySpecificCategoryNfts([...dateArray]);
    console.log("Checking Date Array", dateArray);
  };
  const filterPrice = (price: any) => {
    console.log("Price ->", price);

    let priceArray: any[] = [...displaySpecificCategoryNfts];
    if (Number(price) > 0) {
      priceArray = priceArray.filter(
        (nft: any) => Number(nft.price) <= Number(price)
      );
      setDisplaySpecificCategoryNfts([...priceArray]);
    } else {
      const displayAllAgain = filterCategory(category);
      console.log("date -> ", date);
      displayAllAgain.sort((a: any, b: any) => {
        if (date === 1) {
          return +new Date(a.date) - +new Date(b.date);
        } else {
          return +new Date(b.date) - +new Date(a.date);
        }
      });
      setDisplaySpecificCategoryNfts([...displayAllAgain]);
    }
  };

  const filterDateAndPrice = (filterObj: any) => {
    let modifiedPriceData: any[] = [...displaySpecificCategoryNfts];
    console.log("Checking...");

    if (Number(price)) {
      modifiedPriceData = modifiedPriceData.filter(
        (nft: any) => Number(nft.price) >= Number(price)
      );
    }

    modifiedPriceData.sort((a: any, b: any) => {
      if (date) {
        return +new Date(a.date) - +new Date(b.date);
      } else {
        return +new Date(b.date) - +new Date(a.date);
      }
    });
    console.log("filtered date", modifiedPriceData);
    setDisplaySpecificCategoryNfts(modifiedPriceData);
  };

  const filterCategory = (categoryName: any) => {
    let modifiedCategoriesData = [...displayAllCategoryNfts];
    if (categoryName === "all") {
      return modifiedCategoriesData;
    } else {
      modifiedCategoriesData = modifiedCategoriesData.filter(
        (nft) => nft?.asset.category === categoryName
      );
    }
    return modifiedCategoriesData;
  };

  const applyCategory = (categoryName: any) => {
    const modifiedArr = filterCategory(categoryName);
    setDisplaySpecificCategoryNfts([...modifiedArr]);
  };

  const resetFilterDate = () => {
    // setDate("");
    setPrice("");
    applyCategory(category);
  };

  const setIntialFilterAndDisplayNfts = useCallback(
    (nfts: any[]) => {
      setFilteredNfts([...nfts]);
      setDisplayAllCategoryNfts([...nfts]);
      setDisplaySpecificCategoryNfts([...nfts]);
    },
    [nftList]
  );

  useEffect(() => {
    if (filteredNfts.length === 0) {
      setIntialFilterAndDisplayNfts([...nftList]);
    }
  }, [nftList, setIntialFilterAndDisplayNfts]);

  useEffect(() => {
    setError(false);
    setLoading(true);

    const getNFTs = async () => {
      const items = await fetchNFTs();
      if (items === undefined) {
        setError(true);
      } else {
        console.log(items);
        dispatch(setNfts(items));
      }
      setLoading(false);
    };
    if (!nftList.length) {
      getNFTs();
    } else {
      setLoading(false);
    }
  }, [refresh]);

  // const LoadMore = () => {
  //   setLoadmore(false);
  // };

  const chnageSearch = () => {
    // setSearch(false);
  };

  const handleChange = (event: any, newValue: SetStateAction<number>) => {
    setvalue(newValue);
  };
  const loadingSpinner = () => {
    if (loading) {
      return (
        <div style={{ height: "70vh" }}>
          <Spinner message="Fetching the Latest & Updated data for you, please wait..." />
        </div>
      );
    }
  };
  // const handleLoadMoreChange = () => {
  //   setLoadMore(true);
  // };
  useEffect(() => {
    //fetch categories
    setCategories(["art", "game", "photography", "music", "video"]);
  }, []);

  return (
    <Container sx={{ marginTop: "30px" }}>
      <Stack spacing={2}>
        <Box className="searchDiv">
          <Box className="widthSm">
            <Typography variant="h5" gutterBottom component="div">
              Type your keywords
            </Typography>
          </Box>
          <Box className="widthSm searchbar">
            <Searchbar
              applySearchDebounce={applySearchDebounce}
              icon={
                <SearchRoundedIcon
                  style={{
                    color: "#fff",
                    backgroundColor: "#3772ff",
                    borderRadius: "20px",
                    padding: "5px",
                    fontSize: "large",
                  }}
                  className="searchbarIcon"
                />
              }
            />
          </Box>
        </Box>
        <Divider sx={{ margin: "30px 0px" }} />
        <Box className="searchDiv widthSm">
          <Box className="dropdownWrapper">
            <Dropdown item1="Oldest" item2="Newest" filterDate={filterDate} />
          </Box>
          {/* Categories List */}
          <Box className="widthSm" sx={{ marginRight: "20px" }}>
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
                    key={0}
                    label="All Items"
                    {...allyProps(0)}
                    sx={{ textTransform: "none", color: "#777E90" }}
                    onClick={(e) => {
                      setCategory("all");
                      applyCategory("all");
                    }}
                  />
                  {categories.length &&
                    categories.map((categoryName, i) => (
                      <Tab
                        key={i + 1}
                        label={categoryName}
                        {...allyProps(i + 1)}
                        sx={{ textTransform: "none", color: "#777E90" }}
                        onClick={(e) => {
                          setCategory(categoryName);
                          applyCategory(categoryName);
                        }}
                      />
                    ))}
                </Tabs>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item md={2} className="dropdownWrapper">
            <Box className="dropdownWrapper">
              <SliderComponent filterPrice={filterPrice} />
            </Box>

            {/* <Box className="dropdownWrapper">
            <Dropdown item1="Most Liked" item2="Least Liked" label="PRICE" />
          </Box> */}
            {/* <Box className="dropdownWrapper">
            <Dropdown
              item1="All Colors"
              item2="Black"
              item3="Green"
              item4="Pink"
              item5="Purple"
              label="COLOR"
            />
          </Box> */}
            {/* <Box className="dropdownWrapper">
            <Dropdown
              item1="Verified olny"
              item2="All"
              item3="Most liked"
              label="CREATOR"
            />
          </Box> */}
            <Divider sx={{ margin: "10px 5px" }} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",

                alignItems: "center",
              }}
              className="resetDiv"
            >
              {/* <Button
                className="btnStyle1 mR"
                sx={{ backgroundColor: "blue", color: "#ffffff", mb: 3 }}
                onClick={filterDateAndPrice}
              >
                Apply Fiter
              </Button> */}
              {/* <ButtonComponent
                customStyle={{ marginBottom: 5 }}
                btnColor={"#3772FF"}
                classNames="btnStyle1 mR"
                handleClick={() => filterDateAndPrice()}
              >
                Apply Fiter
              </ButtonComponent> */}
            </Box>
            {/* <Box
              sx={{
                display: "flex",
                flexDirection: "row",

                alignItems: "center",
              }}
              className="resetDiv"
            >
              <img src={reset} alt="icon" className="resetimg" />
              <Typography className="reset" onClick={resetFilterDate}>
                reset filter
              </Typography>
            </Box> */}
          </Grid>

          <Grid item md={9} className="searchCardDiv">
            <Grid
              container
              spacing={2}
              margin={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {error === true ? (
                <Button onClick={(e) => setRefresh(refresh + 1)}>
                  {" "}
                  Refresh{" "}
                </Button>
              ) : !loading ? (
                displaySpecificCategoryNfts.length ? (
                  displaySpecificCategoryNfts
                    .slice(0, index)
                    .map((item: any) => (
                      <Bidcard
                        cardData={item}
                        key={item.tokenId}
                        whiteCard={true}
                      />
                    ))
                ) : (
                  <h3>No Data Found</h3>
                )
              ) : (
                loadingSpinner()
              )}
              {/* {isListingLoading
                ? loadingSpinner()
                : listings?.map((listing) => (
                    <Bidcard
                      cardData={listing}
                      key={listing.asset.id}
                      whiteCard={true}
                    />
                  ))} */}
            </Grid>
            <Grid
              container
              spacing={2}
              margin={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {isCompleted ? (
                <ButtonComponent
                  handleClick={loadMore}
                  btnColor={"#3772FF"}
                  customStyle={{ padding: "20px" }}
                  // className="btn btn-danger disabled"
                >
                  That's It
                </ButtonComponent>
              ) : (
                <ButtonComponent
                  handleClick={loadMore}
                  btnColor={"#3772FF"}
                  customStyle={{ padding: "20px" }}
                  // className="btn btn-danger"
                >
                  Load More +
                </ButtonComponent>
              )}
            </Grid>

            {/* <Pagination
              count={10}
              sx={{ justifyContent: "center" }}
              page={page}
              onChange={handleChangePage}
            /> */}

            {/* <TabPanel value={value} index={0}>
             {loadmore ? (
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ButtonComponent
                  styleType="outline"
                  classNames="headButton"
                  btnColor="#23262F"
                  handleClick={LoadMore}
                  customStyle={{ marginTop: "20px" }}
                >
                  Load more
                </ButtonComponent>
              </Grid>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {Data.filter(function (cardData) {
                  return cardData.id >= 7;
                }).map((item, index) => (
                  <Bidcard cardData={item} key={item.id} whiteCard={true} />
                ))}
              </Grid>
            )} 
           </TabPanel> */}

            {/* <TabPanel value={value} index={1}>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {Data.filter(function (cardData) {
                return cardData.id <= 6;
              }).map((item, index) => (
                <Bidcard cardData={item} key={item.id} whiteCard={true} />
              ))}
            </Grid>
            {loadmore ? (
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ButtonComponent
                  styleType="outline"
                  classNames="headButton"
                  btnColor="#23262F"
                  handleClick={LoadMore}
                  customStyle={{ marginTop: "20px" }}
                >
                  Load more
                </ButtonComponent>
              </Grid>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {Data.filter(function (cardData) {
                  return cardData.id >= 7;
                }).map((item, index) => (
                  <Bidcard cardData={item} key={item.id} whiteCard={true} />
                ))}
              </Grid>
            )}
          </TabPanel> */}

            {/* <TabPanel value={value} index={2}>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {Data.filter(function (cardData) {
                return cardData.id <= 6;
              }).map((item, index) => (
                <Bidcard cardData={item} key={item.id} whiteCard={true} />
              ))}
            </Grid>
            {loadmore ? (
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ButtonComponent
                  styleType="outline"
                  classNames="headButton"
                  btnColor="#23262F"
                  handleClick={LoadMore}
                  customStyle={{ marginTop: "20px" }}
                >
                  Load more
                </ButtonComponent>
              </Grid>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {Data.filter(function (cardData) {
                  return cardData.id >= 7;
                }).map((item, index) => (
                  <Bidcard cardData={item} key={item.id} whiteCard={true} />
                ))}
              </Grid>
            )}
          </TabPanel> */}

            {/* <TabPanel value={value} index={3}>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {Data.filter(function (cardData) {
                return cardData.id <= 6;
              }).map((item, index) => (
                <Bidcard cardData={item} key={item.id} whiteCard={true} />
              ))}
            </Grid>
            {loadmore ? (
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ButtonComponent
                  styleType="outline"
                  classNames="headButton"
                  btnColor="#23262F"
                  handleClick={LoadMore}
                  customStyle={{ marginTop: "20px" }}
                >
                  Load more
                </ButtonComponent>
              </Grid>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {Data.filter(function (cardData) {
                  return cardData.id >= 7;
                }).map((item, index) => (
                  <Bidcard cardData={item} key={item.id} whiteCard={true} />
                ))}
              </Grid>
            )}
          </TabPanel> */}

            {/* <TabPanel value={value} index={4}>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {Data.filter(function (cardData) {
                return cardData.id <= 6;
              }).map((item, index) => (
                <Bidcard cardData={item} key={item.id} whiteCard={true} />
              ))}
            </Grid>
            {loadmore ? (
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ButtonComponent
                  styleType="outline"
                  classNames="headButton"
                  btnColor="#23262F"
                  handleClick={LoadMore}
                  customStyle={{ marginTop: "20px" }}
                >
                  Load more
                </ButtonComponent>
              </Grid>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {Data.filter(function (cardData) {
                  return cardData.id >= 7;
                }).map((item, index) => (
                  <Bidcard cardData={item} key={item.id} whiteCard={true} />
                ))}
              </Grid>
            )}
          </TabPanel> */}

            {/* <TabPanel value={value} index={5}>
            <Grid
              container
              spacing={2}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {Data.filter(function (cardData) {
                return cardData.id <= 6;
              }).map((item, index) => (
                <Bidcard cardData={item} key={item.id} whiteCard={true} />
              ))}
            </Grid>
            {loadmore ? (
              <Grid
                container
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <ButtonComponent
                  styleType="outline"
                  classNames="headButton"
                  btnColor="#23262F"
                  handleClick={LoadMore}
                  customStyle={{ marginTop: "20px" }}
                >
                  Load more
                </ButtonComponent>
              </Grid>
            ) : (
              <Grid
                container
                spacing={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                {Data.filter(function (cardData) {
                  return cardData.id >= 7;
                }).map((item, index) => (
                  <Bidcard cardData={item} key={item.id} whiteCard={true} />
                ))}
              </Grid>
            )}
          </TabPanel> */}
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
};

export default SearchFilter;
