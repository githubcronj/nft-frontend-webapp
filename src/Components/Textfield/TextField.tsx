import { useState, ChangeEvent, useEffect } from "react";
import "./Textfield.css";
import {
  InputBase,
  Box,
  InputLabel,
  NativeSelect,
  FormControl,
  alpha,
  styled,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { apiClient } from "../../axios/instance";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/hooks";
import { setUserCollection } from "../../redux/slices/CollectinSlice";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(3),
  },
  "& .MuiInputBase-input": {
    borderRadius: 15,
    position: "relative",
    color: "#777E90",
    border: "1px solid grey",
    fontSize: 18,
    width: "100%",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface Props {
  setName?: any;
  setDescription?: any;
  setPrice?: any;
  setCollections?: any;
  setCategory?: any;
}

export default function Textfield(props: Props) {
  const { account } = useWeb3React<Web3Provider>();
  // console.log("In TextField", account);
  const myCollections = useAppSelector(
    (state) => state?.collectinSlice?.collections
  );
  console.log("Collections from REDUX -> ", myCollections);
  const [display, setDisplay] = useState<boolean>(false);
  const [enteredCollection, setEnteredCollection] = useState([""]);
  const [collections, setCollections] = useState<any>([]);
  console.log("Collections in TExt ", collections);
  const [categories, setCategories] = useState<any[]>([
    "art",
    "game",
    "photography",
    "music",
    "video",
  ]);
  const dispatch = useDispatch();

  const addNewCollection = () => {
    collections.unshift(enteredCollection);
    setCollections([...collections]);
    props.setCollections(enteredCollection);
  };

  const handleChangeCollection = (event: any) => {
    const { value } = event.target;
    console.log(value);
    props.setCollections(value);
  };
  const handleChangeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    props.setCategory(value);
  };
  const handleChangeItem = (event: ChangeEvent<HTMLSelectElement>) => {
    props.setName(event.target.value);
  };

  useEffect(() => {
    //fetching collections and categories
    // const result1= axios.get('/collections)
    // setCollections(result1.data)
    props.setCollections(collections[0]);
    //setCategories()
    props.setCategory(categories[0]);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // console.log("HandleSubmit --->>>", typeof [enteredCollection]);
    const data = { collections: [enteredCollection] };
    console.log(data);
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    try {
      const results = await apiClient.put(
        `/collection/${account}`,
        data,
        config
      );
      console.log("Collection Put Check", results.data);
      // setLocalStorageValue(results.data.uId)
    } catch (err: any) {
      console.log(err);
    }
  };

  // const fetchCollectionName = async () => {
  //   try {
  //     const result = await apiClient.get(
  //       `http://localhost:15000/api/v1/collection/${account}`
  //     );
  //     console.log("Collection Name Check -> ", result.data.data);
  //     dispatch(setUserCollection(result?.data?.data));
  //   } catch (err: any) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   fetchCollectionName();
  // }, [account]);
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
  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "auto" },
          gap: 2,
          marginTop: "50px",
        }}
      >
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="bootstrap-input">
            ITEM NAME
          </InputLabel>
          <BootstrapInput
            placeholder="e.g.Redeemable Bitcoin Card with logo'"
            id="bootstrap-input"
            onChange={(e) => props.setName(e.target.value)}
          />
        </FormControl>
      </Box>
      <Box
        component="form"
        noValidate
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "auto" },
          gap: 2,
          marginTop: "50px",
        }}
      >
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="bootstrap-input">
            DESCRIPTION
          </InputLabel>
          <BootstrapInput
            placeholder="e.g.'After puchaising you will be recieved the logo...'"
            id="bootstrap-input"
            onChange={(e) => props.setDescription(e.target.value)}
          />
        </FormControl>
      </Box>
      {/* <Box
        component="form"
        noValidate
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "auto" },
          gap: 2,
          marginTop: "50px",
        }}
      >
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="bootstrap-input">
            WEBSITE
          </InputLabel>
          <BootstrapInput
            placeholder="e.g.'After puchaising you will be recieved the logo...'"
            id="bootstrap-input"
            onChange={(e) => props.setWebsite(e.target.value)}
          />
        </FormControl>
      </Box> */}
      {/* <Box
        component="form"
        noValidate
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "auto" },
          gap: 2,
          marginTop: "50px",
        }}
      >
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="bootstrap-input">
            PRICE
          </InputLabel>
          <BootstrapInput
            placeholder="Enter the NFT basic price"
            id="bootstrap-input"
            onChange={(e) => props.setPrice(e.target.value)}
          />
        </FormControl>
      </Box> */}

      {/*--------------------------- COLLECTION PART ---------------------------------------------- */}
      {/* <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "50px",
        }}
      >
        <InputLabel
          sx={{
            fontWeight: "bold",
          }}
        >
          COLLECTIONS
        </InputLabel>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "0.8rem",
          }}
        >
          <FormControl sx={{ m: 1, flex: "0.6" }} variant="standard">
            {!display ? (
              <NativeSelect
                id="collection"
                // value={collection}
                onChange={handleChangeCollection}
                input={<BootstrapInput />}
              >
                {account ? (
                  <>
                    {collections?.length &&
                      collections.map((item: any) => (
                        <>
                          <option value={item}>{item}</option>
                        </>
                      ))}{" "}
                  </>
                ) : null}
              </NativeSelect>
            ) : (
              <BootstrapInput
                placeholder="Enter collection name"
                id="bootstrap-input"
                aria-placeholder={"Please type collection name"}
                onChange={(e: any) => setEnteredCollection(e.target.value)}
              />
            )}
          </FormControl>
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={(e: any) => {
                if (display) {
                  addNewCollection();
                  handleSubmit(e);
                }
                setDisplay(!display);
              }}
            >
              {!display ? "Add Collection" : " Ok "}
            </Button>
          </FormControl>
        </FormControl>
      </Box> */}
      {/* ---------------------------------------------------------------------------------------- */}
      <Box
        component="form"
        noValidate
        sx={{
          display: "grid",
          gridTemplateColumns: { sm: "auto auto auto" },
          gap: 2,
          marginTop: "50px",
        }}
      >
        <FormControl sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="category">CATEGORY</InputLabel>
          <NativeSelect
            id="category"
            // value={category}
            onChange={handleChangeCategory}
            input={<BootstrapInput />}
          >
            {categories?.length &&
              categories.map((item, i) => (
                <option value={item}>{item.toUpperCase()}</option>
              ))}
          </NativeSelect>
        </FormControl>
      </Box>
    </>
  );
}
