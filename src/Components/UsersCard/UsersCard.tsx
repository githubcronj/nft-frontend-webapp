import {
  Grid,
  Button,
  Typography,
  Avatar,
  Box,
  useTheme,
  Link,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import twitterIcon from "../../Assets/images/twitterBlack.svg";
import fbIcon from "../../Assets/images/fbBlackIcon.svg";
import instaIcon from "../../Assets/images/instaBlackIcon.svg";
import shareIconUpload from "../../Assets/images/share icon.png";
import { userInfo } from "../../DB/FollowersCard/FollowersCardArray";
import smallCoin from "../../Assets/images/icons-Coins-Filled.svg";
import shareDotIcon from "../../Assets/images/share-icon.svg";
import LanguageSharpIcon from "@mui/icons-material/LanguageSharp";
import "./UsersCard.css";
import profileBlank from "../../Assets/images/profileBlank.webp";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
interface userCardDetails {
  user: {
    img: string;
    name: string;
    text: string;
    description: string;
    link: string;
    memberShip: string;
  };
}

const useStyles: any = makeStyles(() => ({
  avatar: {
    width: useTheme().spacing(14) + "!important",
    height: useTheme().spacing(14) + "!important",
  },
  nameStyle: {
    fontSize: "21px !important",
    fontWeight: "600 !important",
    marginTop: "20px !important",
  },
  descriptionStyle: {
    fontSize: "12px !important",
    color: "#777E90",
    textAlign: "center",
    marginTop: useTheme().spacing(3) + "!important",
    marginBottom: useTheme().spacing(2) + "!important",
  },
  uploadBtn: {
    textTransform: "none",
    paddingRight: useTheme().spacing(2) + "!important",
    paddingLeft: useTheme().spacing(2) + "!important",
    borderRadius: "16px !important",
    backgroundColor: "#3772FF",
    marginBottom: "25px !important",
    "&:hover": {
      backgroundColor: "#63ADF7 !important",
    },
  },
  iconbox: {
    display: "flex",
    marginTop: useTheme().spacing(3),
    paddingBottom: useTheme().spacing(4),
    borderBottom: "1.5px solid #E2E3E5",
  },
  ShareIcon: {
    width: "35px",
    height: "35px",
    marginLeft: "10px",
    "&:hover": {
      filter:
        "invert(63%) sepia(72%) saturate(7360%) hue-rotate(214deg) brightness(102%) contrast(100%)",
      cursor: "pointer",
    },
  },
  membershipText: {
    fontSize: "12px !important",
    color: "#777E90",
    marginTop: "40px !important",
  },
  GlobeIconStyle: {
    fontSize: "17px !important",
    marginRight: "8px",
    marginBottom: "-3px",
    color: "#474748",
  },
  linkStyles: {
    fontSize: "14px",
    opacity: "0.9",
  },
  linkMargin: {
    marginBottom: "50px",
  },
  linkColor: {
    "&:hover": {
      color: "#4C7AD7",
    },
  },
}));
export const UsersCard = () => {
  const classes = useStyles();
  const { account } = useWeb3React<Web3Provider>();
  console.log("Account Address --> ", account?.substring(0, 5));
  // const userData = useAppSelector((state) => state.userData);

  return (
    <Grid container direction="column" alignItems="center" className="root">
      <FollowersPhoto user={userInfo} />
      <FollowersName user={userInfo} />
      <FolwersRandomText user={userInfo} />
      <FDescription user={userInfo} />
      <LinkWithImg user={userInfo} />
      <UploadButtons />
      <SocialMediaIcon />
      <MembershipCard user={userInfo} />
    </Grid>
  );
};
const FollowersPhoto = (props: userCardDetails) => {
  return (
    <Avatar alt="Nat Geo" className={useStyles().avatar} src={profileBlank} />
  );
};
const FollowersName = (props: userCardDetails) => {
  const userData = useAppSelector((state) => state.userData);
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Typography variant="body2" className={useStyles().nameStyle}>
        {/* {props.user.name} */}
        {userData?.name ? userData?.name : "Not Available"}
      </Typography>
    </Grid>
  );
};
const FolwersRandomText = (props: userCardDetails) => {
  const { account } = useWeb3React<Web3Provider>();
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Typography variant="body2" className={useStyles().linkStyles}>
        {account?.substring(0, 5) ? account?.substring(0, 15) : "Not Available"}
      </Typography>
      {/* <img style={{ marginLeft: "10px" }} src={smallCoin} /> */}
    </Grid>
  );
};
const FDescription = (props: userCardDetails) => {
  const userData = useAppSelector((state) => state.userData);
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Typography className={useStyles().descriptionStyle}>
        {/* {props.user.description} */}
        {userData?.bio ? userData?.bio : "Not Available"}
      </Typography>
    </Grid>
  );
};
const LinkWithImg = (props: userCardDetails) => {
  const userData = useAppSelector((state) => state.userData);
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={useStyles().linkMargin}
    >
      <Link
        href={props.user.link}
        className={useStyles().linkColor}
        sx={{ color: "#5B5959" }}
        variant="body2"
        underline="none"
      >
        {" "}
        <LanguageSharpIcon className={useStyles().GlobeIconStyle} />
        <span className={useStyles().linkStyles}>
          {/* {props.user.link} */}
          {userData?.personalUrl ? userData?.personalUrl : "Not Available"}
        </span>
      </Link>
    </Grid>
  );
};
const UploadButtons = () => {
  const navigate = useNavigate();
  return (
    <Grid>
      <Button
        disableElevation
        variant="contained"
        size="small"
        sx={{ textTransform: "none" }}
        className={useStyles().uploadBtn}
        onClick={() => {
          navigate("/upload");
        }}
      >
        {" "}
        Upload
      </Button>

      <img
        src={shareIconUpload}
        onClick={() => {
          navigate("/upload");
        }}
        className={useStyles().ShareIcon}
      />
      {/* <img src={shareDotIcon} className={useStyles().ShareIcon} /> */}
    </Grid>
  );
};
const SocialMediaIcon = () => {
  const userData = useAppSelector((state) => state.userData);
  return (
    <Grid className={useStyles().iconbox}>
      <Box>
        {/* <Link href={userData?.twitter ? userData?.twitter : "/"}>
          {" "}
          <img src={twitterIcon} className="iconStyle" />
        </Link> */}
        {/* <Link href="/">
          {" "}
          <img src={instaIcon} className="iconStyle" />
        </Link>
        <Link href="/">
          <img src={fbIcon} className="iconStyle" />
        </Link> */}
      </Box>
    </Grid>
  );
};
const MembershipCard = (props: userCardDetails) => {
  const userData = useAppSelector((state) => state.userData);
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Typography className={useStyles().membershipText}>
        {props.user.memberShip}
        <br />
        {userData?.createdAt.substring(0, 15)
          ? userData?.createdAt
          : "Not Available"}
      </Typography>
    </Grid>
  );
};
