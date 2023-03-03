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

import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setNfts, setSelectedNft } from "../../redux/slices/NFTs";
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
  console.log("collection -> ", collection);

  const { fetchNFTs, fetchhMyNFTsOrListedNFTs } = useContext(
    NFTMarketplaceContext
  );
  const nftList = useAppSelector((state) => state.nftsData.nfts);
  const [filteredNfts, setFilteredNfts] = useState(() =>
    nftList.filter((nft) => nft.collections === collection)
  );
  // const [filteredNfts, setFilteredNfts] = useState(() =>
  //   nftList.filter((nft) =>
  //     nft.collections.filter(
  //       (collectionItem: any) => collectionItem === collection
  //     )
  //   )
  // );

  // console.log(
  //   "nftList Filter ---> ",
  //   nftList.filter((nft) => nft.collections === collection)
  // );
  const [displayAllCategoryNfts, setDisplayAllCategoryNfts] = useState([
    ...filteredNfts,
  ]);
  const [displaySpecificCategoryNfts, setDisplaySpecificCategoryNfts] =
    useState(displayAllCategoryNfts);

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
  const [date, setDate] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [category, setCategory] = useState<string>("all");

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
  const filterPrice = () => {
    let priceArray: any[] = [...displaySpecificCategoryNfts];
    if (Number(price)) {
      priceArray = priceArray.filter(
        (nft: any) => Number(nft.price) >= Number(price)
      );
    }
    console.log("Price Array -> ", priceArray);
    setDisplaySpecificCategoryNfts([...priceArray]);
  };
  const filterDateAndPrice = (filterObj: any) => {
    let modifiedPriceData: any[] = [...displaySpecificCategoryNfts];
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

  const filterCategory = (catergoryName: any) => {
    let modifiedCategoriesData = [...displayAllCategoryNfts];
    if (catergoryName === "all") {
      return modifiedCategoriesData;
    } else {
      modifiedCategoriesData = modifiedCategoriesData.filter(
        (nft) => nft.category === catergoryName
      );
    }
    return modifiedCategoriesData;
  };

  const applyCategory = (categoryName: any) => {
    const modifiedArr = filterCategory(categoryName);
    setDisplaySpecificCategoryNfts([...modifiedArr]);
  };

  const resetFilterDate = () => {
    setDate("");
    setPrice("");
    applyCategory(category);
  };

  const setIntialFilterAndDisplayNfts = useCallback(
    (nfts: any[]) => {
      // const modifiedArr: any[] = nfts.filter((nft) =>
      //   nft.collections.filter(
      //     (collectionItem: any) => collectionItem === collection
      //   )
      // );
      const modifiedArr: any[] = nfts.filter(
        (nft) => nft.collections === collection
      );
      console.log("Check Modified Collection -> ", modifiedArr);
      setFilteredNfts([...modifiedArr]);
      setDisplayAllCategoryNfts([...modifiedArr]);
      setDisplaySpecificCategoryNfts([...modifiedArr]);
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

  const LoadMore = () => {
    setLoadmore(false);
  };

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

  useEffect(() => {
    //fetch categories
    setCategories(["art", "game", "photography", "music", "video"]);
  }, []);

  //TESTING LOAD MORE----------------------
  const [isCompleted, setIsCompleted] = useState(false);
  const [index, setIndex] = useState(6);
  const loadMore = () => {
    setIndex(index + 6);
    console.log("INDEX -> ", index);
    if (index >= displaySpecificCategoryNfts.length) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };
  //ENDS HERE--------------------------------------------

  return (
    <Container sx={{ marginTop: "30px" }}>
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
          <Dropdown item1="Newest" item2="Oldest" filterDate={filterDate} />
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
                      sx={{ textTransform: "capitalize", color: "#777E90" }}
                      onClick={(e) => {
                        setCategory(categoryName);
                        applyCategory(categoryName);
                      }}
                    />
                  ))}
                {/* <Tab
                    label="Art"
                    {...allyProps(1)}
                    sx={{ textTransform: "none", color: "#777E90" }}
                  /> */}
                {/* <Tab
                    label="Game"
                    {...allyProps(2)}
                    sx={{ textTransform: "none", color: "#777E90" }}
                  />
                  <Tab
                    label="Photography"
                    {...allyProps(3)}
                    sx={{ textTransform: "none", color: "#777E90" }}
                  />
                  <Tab
                    label="Music"
                    {...allyProps(4)}
                    sx={{ textTransform: "none", color: "#777E90" }}
                  />
                  <Tab
                    label="Video"
                    {...allyProps(5)}
                    sx={{ textTransform: "none", color: "#777E90" }}
                  /> */}
              </Tabs>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
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
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",

              alignItems: "center",
            }}
            className="resetDiv"
          >
            <Button onClick={filterDateAndPrice}>Apply Fiter</Button>
          </Box> */}
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
                  .map((item, index) => (
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
    </Container>
  );
};

export default SearchFilter;
