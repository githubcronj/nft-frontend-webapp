import React, { useContext, useState, useEffect } from "react";
import { FC } from "react";
import "./CardCollection.css";
import Carousel from "react-elastic-carousel";
import Data from "../../DB/CardCollection/CardCollectionArray";
import {
  Container,
  Box,
  Card,
  Button,
  Typography,
  CardMedia,
} from "@mui/material";
import leftArrow from "../../Assets/images/Left.svg";
import { Link, useNavigate } from "react-router-dom";
import rightArrow from "../../Assets/images/RightArrow.svg";
import { useAppSelector } from "../../redux/hooks";
import { apiClient } from "../../axios/instance";

interface Props {
  cardData: any;
}

const CardCollectionIndex = ({ cardData }: Props) => {
  // console.log("cardData", cardData);
  const navigate = useNavigate();

  return (
    <>
      <Container>
        <Box>
          <Card
            key={cardData.id}
            sx={{
              textAlign: "center",
              boxShadow: "0px 0px 2px 0px black;",
              cursor: "pointer",
              // margin: "10px 10px",
              border: "3px solid ",
              borderRadius: "30px",
              padding: "25px",
            }}
            onClick={() => navigate(`/search-filter/collection/${cardData}`)}
          >
            <Link to="/" className="linkUnderline">
              {/* <img
                className="changewidth1"
                src={cardData?.image ? cardData?.image : cardData.mainImg}
              /> */}
            </Link>
            {/* {cardData.length > 0 &&
              cardData.map((item: any, index: any) => ( */}
            <Box>
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "left",
                  marginLeft: "10px",
                }}
                component="p"
                className="autName"
              >
                {/* Awesome collections */}
                {cardData}
                {/* {console.log("item Collection--> ", index, item)} */}
              </Typography>
            </Box>
            {/* ))} */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                margin: "10px",
              }}
            >
              {" "}
              <span className="rowBox">
                <img src={cardData.authorImg} />
                <Typography
                  sx={{ fontSize: "14px", fontWeight: "bold" }}
                  component="p"
                >
                  {" "}
                  {/* <span>By </span> */}
                  {/* {cardData?.owner.substring(0, 5) ? cardData?.owner : "..."} */}
                  {/* CronJ */}
                </Typography>
              </span>
              <Button variant="outlined" className="autItem">
                {cardData.item} items
              </Button>
            </Box>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default CardCollectionIndex;
