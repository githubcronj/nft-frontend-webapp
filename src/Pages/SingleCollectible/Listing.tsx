import React, { useState } from "react";
import {
  useAddress,
  useContract,
  MediaRenderer,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
  useCreateAuctionListing,
  useCreateDirectListing,
} from "@thirdweb-dev/react";
import Container from "@material-ui/core/Container";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  CardMedia,
  CardActionArea,
  CardActions,
} from "@mui/material";
import {
  NFT,
  ChainId,
  NATIVE_TOKENS,
  NATIVE_TOKEN_ADDRESS,
} from "@thirdweb-dev/sdk";
import Button from "@material-ui/core/Button";
import netowork from "../../utils/netowork";
import { Link, useNavigate } from "react-router-dom";
import {
  NFT_COLLECTION_ADDRESS,
  NFT_MARKETPLACE_ADDRESS,
} from "../../constants/Constants";
import Bidcard from "../../Components/Bidcard/Bidcard";
import PlaceaBidModals from "../../Components/Modals/PlaceaBidModal/PlaceaBidModals";
import { Paper, TextField } from "@material-ui/core";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";
import toast, { Toaster } from "react-hot-toast";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Spinner from "../../Spinner/Spinner";

const Listing = () => {
  const address = useAddress();
  const navigate = useNavigate();
  const [selectedNFT, setSelectedNFT] = useState<NFT>();
  console.log("SElected ", selectedNFT);
  const { contract } = useContract(NFT_MARKETPLACE_ADDRESS, "marketplace");
  const { contract: collectionContract, isLoading: collectionLoading } =
    useContract(NFT_COLLECTION_ADDRESS, "nft-collection");

  const ownedNFT = useOwnedNFTs(collectionContract, address);
  const networkMismatch = useNetworkMismatch();
  const {
    mutate: createDirectListing,
    isLoading: isCreateDirectListingLoading,
    error: createListingError,
  } = useCreateDirectListing(contract);

  const {
    mutate: createAuctionListing,
    isLoading: isAuctionListingLoading,
    error: auctionListingError,
  } = useCreateAuctionListing(contract);

  const [, switchNetwork] = useNetwork();
  const [price, setPrice] = useState<any>();
  console.log("price ", price);
  const [value, setValue] = React.useState("direct");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  // console.log("Listing nft id --> ", selectedNFT?.metadata.id);
  //create listing
  const handleCreateListing = async () => {
    if (networkMismatch) {
      switchNetwork && switchNetwork(netowork);
      return;
    }
    if (!selectedNFT) return;

    if (value === "directListing") {
      // toast.loading("Loading...", {
      //   style: {
      //     background: "#04111d",
      //     color: "#fff",
      //   },
      // });
      createDirectListing(
        {
          //Collection Address
          assetContractAddress: NFT_COLLECTION_ADDRESS,
          tokenId: selectedNFT.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, //1 week
          quantity: 1,
          buyoutPricePerToken: price,
          startTimestamp: new Date(),
        },
        {
          onSuccess(date, variables, context) {
            console.log("SUCCESS : ", date, variables, context);
            toast.success("NFT Listed Successfully", {
              style: {
                background: "#04111d",
                color: "#fff",
              },
            });
            navigate("/home");
          },
          onError(date, variables, context) {
            console.log("ERROR : ", date, variables, context);
            toast.error("Error while listing NFT", {
              style: {
                background: "#04111d",
                color: "#fff",
              },
            });
          },
        }
      );
    }

    if (value === "auctionListing") {
      // toast.loading("Loading...", {
      //   style: {
      //     background: "#04111d",
      //     color: "#fff",
      //   },
      // });
      createAuctionListing(
        {
          assetContractAddress: NFT_COLLECTION_ADDRESS,
          buyoutPricePerToken: price,
          startTimestamp: new Date(),
          tokenId: selectedNFT.metadata.id,
          currencyContractAddress: NATIVE_TOKEN_ADDRESS,
          listingDurationInSeconds: 60 * 60 * 24 * 7, //1 week
          quantity: 1,
          reservePricePerToken: 0,
        },
        {
          onSuccess(date, variables, context) {
            console.log("SUCCESS : ", date, variables, context);
            toast.success("NFT Listed Successfully", {
              style: {
                background: "#04111d",
                color: "#fff",
              },
            });
            navigate("/home");
          },
          onError(date, variables, context) {
            console.log("ERROR : ", date, variables, context);
            toast.error("Error while listing NFT", {
              style: {
                background: "#04111d",
                color: "#fff",
              },
            });
          },
        }
      );
    }
  };

  const loadingSpinner = () => {
    return (
      <div
        style={{
          height: "70vh",
        }}
      >
        <Spinner message="Fetching the Latest & Updated data for you, please wait..." />
      </div>
    );
  };

  // console.log("Radio Value --> ", value);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Container>
        <Box paddingTop="40px">
          <Typography variant="h5">List your minted NFT</Typography>
          <Typography variant="subtitle2">
            Select your minted Item you would like to sell on CronJ NFT
            Marketplace
          </Typography>
        </Box>
        <hr />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "30px",
            // border: selectedNFT ? "1px solid black" : null,
            margin: "auto",
          }}
        >
          {collectionLoading ? (
            loadingSpinner()
          ) : !ownedNFT?.data?.length ||
            ownedNFT?.data?.length === undefined ? (
            <Box sx={{ alignItems: "center" }}>
              <Typography> No Data Found</Typography>
            </Box>
          ) : (
            ownedNFT?.data?.map((nft) => (
              <>
                <Card
                  sx={{
                    width: 245,
                    border:
                      selectedNFT?.metadata.id === nft?.metadata.id
                        ? "1px solid black"
                        : null,
                  }}
                  onClick={() => setSelectedNFT(nft)}
                  key={nft.metadata.id}
                >
                  <CardActionArea>
                    <MediaRenderer
                      className="cardmedia"
                      style={{ width: "245px", height: "300px" }}
                      src={nft.metadata.image}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {nft.metadata.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {nft.metadata.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </>
            ))
          )}
        </Box>
        <Box>
          {selectedNFT && (
            <Box>
              <Box
                padding="10px"
                sx={{ mt: 2 }}
                display="flex"
                alignItems="center"
                gap="20px"
              >
                <Typography> Price: </Typography>
                <TextField
                  id="outlined-basic"
                  label="Listing Price"
                  variant="outlined"
                  value={price}
                  onChange={(e: any) => setPrice(e.target.value)}
                />
              </Box>
              <Box>
                <FormControl sx={{ mt: 2 }}>
                  <FormLabel
                    sx={{ fontWeight: "bold" }}
                    id="demo-controlled-radio-buttons-group"
                  >
                    Listing Type
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="directListing"
                      control={<Radio />}
                      label="Direct"
                    />
                    <FormControlLabel
                      value="auctionListing"
                      control={<Radio />}
                      label="Auction"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
              <ButtonComponent
                btnColor={"#3772FF"}
                classNames="btnStyle1 mR"
                handleClick={handleCreateListing}
                customStyle={{ marginTop: "10px" }}
              >
                Create Listing
              </ButtonComponent>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Listing;
