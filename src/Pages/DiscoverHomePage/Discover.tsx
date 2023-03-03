import React, {
  ReactNode,
  useState,
  SetStateAction,
  useEffect,
  useCallback,
} from "react";
import {
  Divider,
  Container,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import "./Discover.css";
import Dropdown from "../../Common/Dropdown/Dropdown";
import filter from "../../Assets/images/filter.svg";
import cross from "../../Assets/images/filterCross.svg";
import Data from "../../DB/BidCard/BidcardArray";
import Bidcard from "../../Components/Bidcard/Bidcard";
import SliderComponent from "../../Components/Slider/Slider";
import { useAppSelector } from "../../redux/hooks";
import Spinner from "../../Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import reset from "../../Assets/images/resetFilter.svg";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";
import {
  useActiveListings,
  useAddress,
  useContract,
  useOffers,
} from "@thirdweb-dev/react";
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

function allyProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Discover = () => {
  // const { collection } = useParams();
  // console.log("collection", collection);
  // const offers = useOffers(contract, listingId);
  const address = useAddress();
  const { contract } = useContract(NFT_MARKETPLACE_ADDRESS, "marketplace");
  // console.log("Cotnract -> ", contract);
  const { data: listings, isLoading: isListingLoading } =
    useActiveListings(contract);
  console.log("LISTINGS -> ", listings);
  // const listingId = listings?.asset?.id;
  // const offers = useOffers(contract, listings?.asset?.id);
  const [value, setvalue] = useState(0);
  const [openFilter, setOpenFilter] = useState(false);
  const nftList = useAppSelector((state) => state.nftsData?.nfts);
  console.log("Discover NFTs --> ", nftList);
  const [filteredNfts, setFilteredNfts] = useState([...nftList]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [refresh, setRefresh] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [price, setPrice] = useState<string>("0");
  const [category, setCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [displayAllCategoryNfts, setDisplayAllCategoryNfts] = useState([
    ...filteredNfts,
  ]);
  const [displaySpecificCategoryNfts, setDisplaySpecificCategoryNfts] =
    useState(displayAllCategoryNfts);
  const HandleOpen = () => {
    setOpenFilter(!openFilter);
  };
  const navigate = useNavigate();
  const handleChange = (event: any, newValue: SetStateAction<number>) => {
    setvalue(newValue);
  };
  useEffect(() => {
    //fetch categories
    setCategories(["art", "game", "photography", "music", "video"]);
  }, []);

  useEffect(() => {
    if (nftList === undefined || nftList.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [nftList]);

  const loadingSpinner = () => {
    if (loading) {
      return (
        <div style={{ height: "70vh", color: "blue" }}>
          <Spinner message="Fetching the Latest & Updated data for you, please wait..." />
        </div>
      );
    }
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
        return +new Date(b.date) - +new Date(a.date);
      }
      return +new Date(a.date) - +new Date(b.date);
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
        (nft) => nft.category === categoryName
      );
    }
    return modifiedCategoriesData;
  };

  const applyCategory = (categoryName: any) => {
    const modifiedArr = filterCategory(categoryName);
    setDisplaySpecificCategoryNfts([...modifiedArr]);
    console.log("TEST CAT----->>", modifiedArr);
  };
  console.log(" Specific Category -->> ", displaySpecificCategoryNfts);
  const resetFilterDate = () => {
    setDate("");
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

  return (
    <Box>
      <Box sx={{ margin: "50px 30px" }}>
        <Typography
          variant="h3"
          gutterBottom
          component="div"
          sx={{ fontWeight: "bold" }}
        >
          Discover
        </Typography>
        {/* <Button
          sx={{ float: "right", backgroundColor: "blue" }}
          onClick={() => navigate("/search-filter")}
        >
          {" "}
          View More{" "}
        </Button> */}
        {/* <ButtonComponent
          customStyle={{ float: "right", backgroundColor: "blue" }}
          handleClick={() => {
            navigate("/search-filter");
          }}
        >
          View More
        </ButtonComponent> */}

        <ButtonComponent
          customStyle={{ float: "right" }}
          btnColor={"#3772FF"}
          classNames="btnStyle1 mR"
          handleClick={() => navigate("/search-filter")}
        >
          View More
        </ButtonComponent>
      </Box>
      {/* <Grid container className="ItemWrapper">
        <Box className="discoverDropdown">
          <Dropdown item1="Newest" item2="Oldest" setDate={setDate}></Dropdown>
        </Box>
        <Box className="discoverDropdown displayInTab">
          <Dropdown
            item1="All items"
            item2="Art"
            item3="Game"
            item4="Photo"
            item5="Video"
          ></Dropdown>
        </Box>
        <Box className="hideInTab">
          <Grid className="navpillStylingDiscover">
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
              </Tabs>
            </Grid>
          </Grid>
        </Box>
        <Box className="filterBox">
          <Button
            variant="contained"
            className="filterButton"
            onClick={HandleOpen}
          >
            Filter
            <img
              src={openFilter ? cross : filter}
              alt="icon"
              className="filterIcon"
            />
          </Button>
        </Box>
      </Grid> */}
      {openFilter ? (
        <Box>
          <Divider sx={{ margin: "30px 8px" }} />
          <Grid container className="ItemWrapper">
            {/* <Box className="discoverDropdownBelow">
              <Dropdown
                item1="Highest price"
                item2="The lowest price"
                label="PRICE"
              ></Dropdown>
            </Box>
            <Box className="discoverDropdownBelow">
              <Dropdown
                item1="Most liked"
                item2="Least Liked"
                label="LIKES"
              ></Dropdown>
            </Box>
            <Box className="discoverDropdownBelow">
              <Dropdown
                item1="Verified only"
                item2="All"
                item3="Most liked"
                label="CREATOR"
              ></Dropdown>
            </Box> */}
            <Box className="discoverDropdownBelow">
              {/* <SliderComponent setPrice={setPrice} /> */}
            </Box>
            <Button
              sx={{ backgroundColor: "blue", color: "#ffffff" }}
              onClick={filterDateAndPrice}
            >
              Apply Fiter
            </Button>
            <Box
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
            </Box>
          </Grid>
        </Box>
      ) : null}

      <Box className="bidcardDiv">
        <TabPanel value={value} index={0}>
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
            {/* {error === true ? (
              <Button onClick={(e) => setRefresh(refresh + 1)}>
                {" "}
                Refresh{" "}
              </Button>
            ) : !loading ? (
              nftList.length ? (
                nftList
                  .slice(0, 8)
                  .map((item, index) => (
                    <Bidcard
                      cardData={item.asset}
                      key={item.asset.id}
                      whiteCard={true}
                    />
                  ))
              ) : (
                <h3>No Data Found</h3>
              )
            ) : (
              loadingSpinner()
            )} */}

            {isListingLoading
              ? loadingSpinner()
              : listings?.map((listing) => (
                  <Bidcard
                    cardData={listing}
                    key={listing.asset.id}
                    whiteCard={true}
                  />
                ))}
          </Grid>
        </TabPanel>
        {/* <TabPanel value={value} index={1}>
          <Grid container className="ItemWrapper1">
            {nftList.map((item, index) => (
              <Bidcard cardData={item} key={item.id} />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Grid container className="ItemWrapper1">
            {nftList.map((item, index) => (
              <Bidcard cardData={item} key={item.id} />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Grid container className="ItemWrapper1">
            {nftList.map((item, index) => (
              <Bidcard cardData={item} key={item.id} />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Grid container className="ItemWrapper1">
            {nftList.map((item, index) => (
              <Bidcard cardData={item} key={item.id} />
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Grid container className="ItemWrapper1">
            {nftList ? (
              nftList.map((item, index) => (
                <Bidcard cardData={item} key={item.id} />
              ))
            ) : (
              <h4> No Data For Now</h4>
            )}
          </Grid>
        </TabPanel> */}
      </Box>
    </Box>
  );
};

export default Discover;
