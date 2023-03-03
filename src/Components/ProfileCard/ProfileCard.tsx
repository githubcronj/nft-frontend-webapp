import React from "react";
import "./ProfileCard.css";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import avatar from "../../Assets/images/profileAvatar.svg";
import { Avatar } from "@material-ui/core";
import profileBlank from "../../Assets/images/profileBlank.webp";

const ProfileCard = (props: any) => {
  return (
    <>
      <Box className="profileWrapper">
        <Box>
          <Avatar src={profileBlank} alt="avatar" className="profileImg" />
        </Box>
        <Box>
          <Typography variant="h6" component="span" className="ETHCount">
            {/* {props.price ? props.price : null} */}
            {props.price}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ProfileCard;
