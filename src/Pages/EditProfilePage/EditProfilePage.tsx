import {
  Avatar,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./EditProfilePage.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import img1 from "../../Assets/images/enrieCole.png";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import { CloudflareProvider, Web3Provider } from "@ethersproject/providers";
import { useAppSelector } from "../../redux/hooks";
import { apiClient } from "../../axios/instance";
import { useAddress } from "@thirdweb-dev/react";

export default function EditProfilePage() {
  const userData = useAppSelector((state) => state.userData);
  const { account } = useWeb3React<Web3Provider>();
  const [name, setName] = useState<string>(
    userData?.name ? userData?.name : ""
  );
  const walletAddress = useAddress();
  const [address, setAddress] = useState<string>(
    walletAddress ? walletAddress : ""
  );
  const [bio, setBio] = useState<string>(userData?.bio ? userData.bio : "");
  const [personalUrl, setpersonalUrl] = useState<string>(
    userData?.personalUrl ? userData.personalUrl : ""
  );
  const [twitter, setTwitter] = useState<string>(
    userData?.twitter ? userData.twitter : ""
  );
  const [selectedFile, setSelectedFile] = useState<any>();

  const url = "http://localhost:15000/api/v1";

  const handleFileSelect = (e: any) => {
    setSelectedFile(e.target.files[0]);
    console.log("File --> ", selectedFile);
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append("file", selectedFile);
    const data = {
      name,
      // walletId: walletAddress,
      bio,
      personalUrl,
      twitter,
    };
    console.log(data);
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    // const imgConfig = {
    //   headers: { "Content-Type": "multipart/form-data" },
    // };
    try {
      const results = await axios.put(
        `http://localhost:5000/api/v1/updateUser/${walletAddress}`,
        data,
        config
      );
      // const resultsImg = await axios.post(`${url}/users`, formData, imgConfig);
      console.log(results.data);
      navigate("/profile-page");
      // console.log(resultsImg.data);
      // setLocalStorageValue(results.data.uId)
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Grid>
      <Paper className="headContainer">
        <Link to="/profile-page" className="linkUnderline">
          <Button className="backToProfileBtn">
            <span style={{ marginRight: "8px", marginTop: "3px" }}>
              <KeyboardBackspaceIcon fontSize="small" />
            </span>
            Back to profile
          </Button>
        </Link>
        <Grid
          style={{ textTransform: "none", fontSize: "#777E90v" }}
          className="profilespan"
        >
          <Link
            to="/profile-page"
            style={{ marginRight: "16px" }}
            className="profileLink linkUnderline"
          >
            Profile
          </Link>
          <KeyboardArrowRightIcon fontSize="small" sx={{ color: "#777E90" }} />
          <span style={{ color: "#23262F", marginLeft: "16px" }}>
            Edit Profile
          </span>
        </Grid>
      </Paper>
      <Grid className="headDiv">
        <Grid className="ProfileSectionStyle">
          <p className="EditPageHeading">Edit profile</p>
          <p className="EditPagepara">
            You can set preferred display name, create your profile URL and
            manage other personal settings.
          </p>
          <Grid className="EditPageContent">
            <Grid className="ProfileGrid">
              <Avatar src={img1} className="profilePicstyle" />
              <Grid>
                <p style={{ fontSize: "16px", fontWeight: "600" }}>
                  Profile Photo
                </p>
                <p style={{ fontSize: "12px", color: "#777E90" }}>
                  We recommend an image of at least 400x400.Gifs work too 🙌
                </p>
                <Button
                  className="uploadBtn"
                  component="label"
                  sx={{
                    textTransform: "none",
                    borderRadius: "20px",
                    color: "#23262F",
                    border: "2px solid #E6E8EC",
                    padding: "5px 20px",
                    fontSize: "13px",
                  }}
                >
                  Upload
                  <input type="file" hidden onChange={handleFileSelect} />
                </Button>
              </Grid>
            </Grid>
            <FormControl className="AccountInfoStyle">
              <Grid className="tst">
                <Grid className="width_in_formControl">
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "0px",
                    }}
                  >
                    Account Info
                  </p>
                  <p className="labelStyling" style={{ marginTop: "30px" }}>
                    DISPLAY NAME
                  </p>
                  <TextField
                    label="Enter your display name"
                    className="textField_styling"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <p className="labelStyling" style={{ marginTop: "30px" }}>
                    Wallet Address
                  </p>
                  <TextField
                    label={walletAddress}
                    className="textField_styling"
                    disabled
                    // onChange={(e) => {
                    //   setAddress(e.target.value);
                    // }}
                  />
                  <p className="labelStyling" style={{ marginTop: "30px" }}>
                    BIO
                  </p>
                  <TextField
                    label="About yourselt in a few words"
                    multiline
                    rows={3}
                    className="textField_styling"
                    onChange={(e) => {
                      setBio(e.target.value);
                    }}
                  />
                </Grid>
                <Grid className="width_in_formControl">
                  <p
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "0px",
                    }}
                  >
                    Social
                  </p>
                  <p className="labelStyling" style={{ marginTop: "30px" }}>
                    PORTFOLIO OR WEBSITE
                  </p>
                  <TextField
                    label="Enter URL"
                    className="textField_styling"
                    onChange={(e) => {
                      setpersonalUrl(e.target.value);
                    }}
                  />
                  <p className="labelStyling" style={{ marginTop: "30px" }}>
                    TWITTER
                  </p>
                  <Grid className="idtextfield">
                    <input
                      className="twitterInput"
                      placeholder="@twitter username"
                      onChange={(e) => {
                        setTwitter(e.target.value);
                      }}
                    />
                    {/* <Button
                      className="verifyButton"
                      sx={{
                        textTransform: "none",
                        borderRadius: "20px",
                        color: "#777E90",
                        border: "2px solid #E6E8EC",
                        padding: "5px 10px",
                        marginTop: "7px",
                        fontSize: "13px",
                      }}
                    >
                      Verify account
                    </Button> */}
                  </Grid>
                  {/* <Button
                    className="AddMoreButton"
                    sx={{
                      textTransform: "none",
                      borderRadius: "20px",
                      color: "#777E90",
                      border: "2px solid #E6E8EC",
                      padding: "5px 20px",
                      marginTop: "20px",
                      fontSize: "13px",
                    }}
                  >
                    <span>
                      <AddCircleOutlineOutlinedIcon
                        fontSize="small"
                        sx={{ marginTop: "7px", marginRight: "12px" }}
                      />
                    </span>{" "}
                    Add more social account
                  </Button> */}
                </Grid>
              </Grid>
              <Grid className="buttom_grid">
                <p style={{ color: "#777E90", fontSize: "14px", width: "80%" }}>
                  To update your settings you should sign message through your
                  wallet. Click 'Update profile' then sign the message
                </p>
                <Grid className="updateBtnClass">
                  <Button
                    className="updateBtn"
                    sx={{
                      textTransform: "none",
                      borderRadius: "20px",
                      color: "#fff",
                      backgroundColor: "#3772ff ",
                      border: "2px solid #E6E8EC",
                      padding: "7px 20px",
                      fontSize: "15px",
                    }}
                    onClick={handleSubmit}
                  >
                    Update Profile
                  </Button>

                  {/* <Button
                    className="clearBtn"
                    sx={{
                      textTransform: "none",
                      border: "none",
                      color: "#777E90",
                      padding: "5px 20px",
                      fontSize: "15px",
                    }}
                  >
                    <span>
                      <CancelOutlinedIcon
                        fontSize="small"
                        sx={{ marginRight: "7px", marginTop: "5px" }}
                      />
                    </span>
                    Clear all
                  </Button> */}
                </Grid>
              </Grid>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
