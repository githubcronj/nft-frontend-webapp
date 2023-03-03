import { useState, FC, useEffect } from "react";
import "./bidcard.css";
import bidIcon from "../../Assets/images/bidIcon.svg";
import candleStick from "../../Assets/images/candleStick.svg";
import {
  CardMedia,
  CardContent,
  Box,
  Card,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceaBidModals from "../Modals/PlaceaBidModal/PlaceaBidModals";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setSelectedNft } from "../../redux/slices/NFTs";

interface Props {
  cardData: any;
  whiteCard?: boolean;
  type?: any;
  values?: any;
}

const Bidcard: FC<Props> = ({ cardData, type, values }, props) => {
  // console.log("CARD DATA -> ", cardData);
  const [pressed, setPressed] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClickHandler = () => {
    dispatch(setSelectedNft(cardData));
    // console.log("OWNED!! --> ", type);
    if (type === "owned") {
      navigate(`/item-owned?id=${cardData?.asset.id}`);
    } else {
      navigate(`/item?id=${cardData?.asset.id}`);
    }
  };
  const pressing = () => {
    setPressed(!pressed);
  };

  return (
    <>
      {cardData.whiteCard ? (
        <Paper
          sx={{
            boxShadow: "0px 64px 64px #1F2F461F",
            borderRadius: "20px",
            padding: "0px",
            margin: "25px 5px",
          }}
          className="cardPaper"
        >
          <Card
            style={{
              boxShadow: "none",
              width: "200px",
              height: "400px",
            }}
            className="withMargin"
          >
            <Box className="boxwrap">
              <CardMedia
                component="img"
                // image={cardData.mainImg}
                image={cardData.asset.image}
                alt="green iguana"
                className="cardmedia"
                sx={{ width: "250px", height: "150px" }}
              />
            </Box>
            <Box>
              <PlaceaBidModals
                cardData={cardData}
                bidcard={true}
                logo={bidIcon}
                type={type}
                values={values}
              />
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
              {/* <Box>
                <Typography className="purchase">PURCHASING !</Typography>
              </Box> */}
              {/* <Box>
                {pressed ? (
                  <FavoriteIcon
                    className="heart"
                    onClick={pressing}
                    style={{ color: "#EF466F" }}
                  />
                ) : (
                  <FavoriteBorderIcon className="heart" onClick={pressing} />
                )}
              </Box> */}
            </Box>
            <Link to="/item" className="linkUnderline">
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "5px",
                  cursoe: "pointer",
                }}
              >
                <Box>
                  <Typography variant="h6" color="black">
                    {cardData.asset.name}
                    {/* {item?.name} */}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" className="greenText">
                    {/* {cardData.ETH} ETH */}
                    {cardData.buyoutCurrencyValuePerToken.displayValue} ETH
                    {/* {item?.price} */}
                  </Typography>
                </Box>
              </CardContent>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "5px",
                }}
              >
                <Box>
                  {cardData.creator.map((curr: any, index: number) => (
                    <img src={curr} className="icons" key={index} />
                  ))}
                </Box>

                <Typography variant="caption" className="inStock">
                  1 in stock
                </Typography>
              </CardContent>
              <Box>
                <Divider />
              </Box>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "5px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "cenownedter",
                  }}
                >
                  <img
                    src={candleStick}
                    alt="{creatorImg}"
                    style={{ marginRight: "5px" }}
                  />
                  <Typography variant="caption" className="bid">
                    Price{" "}
                    <span className="eth">
                      {cardData.buyoutCurrencyValuePerToken.displayValue} ETH
                    </span>
                  </Typography>
                </Box>

                <Typography variant="caption" className="newBid">
                  {/* {cardData.bidType} */}
                </Typography>
              </CardContent>
            </Link>
          </Card>
        </Paper>
      ) : (
        <Card
          style={{
            boxShadow: "0px 64px 64px #1F2F461F",
            height: "370px",
            borderRadius: "20px",
            // border: "0.2px solid black",
          }}
          className="withMargin"
        >
          <Box className="boxwrap">
            <CardMedia
              component="img"
              image={cardData.asset.image}
              alt="green iguana"
              className="cardmedia"
              sx={{ width: "250px", height: "250px" }}
            />
          </Box>
          <Box>
            <PlaceaBidModals
              cardData={cardData}
              bidcard={true}
              logo={bidIcon}
              values={values}
            />
          </Box>
          {/* <Box
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
                <FavoriteBorderIcon className="heart" onClick={pressing} />
              )}
            </Box>
          </Box> */}
          {/* <Link to={`/item?id=${cardData.tokenId}&tokenURI=${cardData.tokenURI}`} className="linkUnderline"> */}
          <Box style={{ cursor: "pointer" }} onClick={onClickHandler}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "5px",
                cursoe: "pointer",
              }}
            >
              <Box>
                <Typography variant="h6" color="black">
                  {/* {cardData.artName} */}
                  {cardData.asset.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" className="greenText">
                  {/* {cardData.ETH} ETH */}
                  {cardData.buyoutCurrencyValuePerToken.displayValue} ETH
                </Typography>
              </Box>
            </CardContent>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "5px",
              }}
            >
              <Box>
                {/* {cardData.creator.map((curr: any, index: number) => (
                  <img src={curr} className="icons" key={index} />
                ))} */}
              </Box>

              <Typography variant="caption" className="inStock">
                {/* {cardData.inStock} in stock */}1 in stock
              </Typography>
            </CardContent>
            <Box>
              <Divider />
            </Box>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: "5px",
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
                  Price{" "}
                  <span className="eth">
                    {cardData.buyoutCurrencyValuePerToken.displayValue} ETH
                  </span>
                </Typography>
              </Box>

              <Typography
                variant="caption"
                className="newBid"
                color={cardData?.type === 1 ? "red" : "green"}
              >
                {cardData?.type === 1 ? "Auction" : "Direct"}
              </Typography>
            </CardContent>
          </Box>
          {/* </Link> */}
        </Card>
      )}
    </>
  );
};

export default Bidcard;
