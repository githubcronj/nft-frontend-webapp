import { Container, Typography, Grid, Divider, Box } from "@mui/material";
import card from "../../Assets/images/CrypterEnd.png";
import cronjLogo from "../../Assets/images/cronjLogo.png";
import "./CrypterEnd.css";
import { Link } from "react-router-dom";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";

const alignBox1 = {
  display: "flex",
  justifyContent: "center",
};
const CrypterEnd = () => {
  return (
    <>
      {/* <Divider /> */}
      <Container>
        <Grid container sx={{ margin: "50px 0px" }}>
          <Grid item md={6} sm={6}>
            <Box>
              <Box className="alignBox">
                <Typography className="fontE1">
                  Buy or Sell NFT's Swiftly
                </Typography>
                <Typography className="fontE2">Just Simply Amazing</Typography>
                <Typography className="fontE3">
                  Your trusted NFT partner
                </Typography>
                <Box sx={{ margin: "10px 0px" }}>
                  <Link to="/Upload" className="linkUnderline">
                    <ButtonComponent
                      btnColor={"#3772FF"}
                      classNames="btnStyle1 mR"
                    >
                      Create item
                    </ButtonComponent>
                  </Link>
                  <Link to="/Discover" className="linkUnderline">
                    <ButtonComponent
                      btnColor={"#23262F"}
                      styleType={"outline"}
                      classNames="btnStyle1"
                    >
                      Discover
                    </ButtonComponent>
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={6} sm={6}>
            <Box sx={alignBox1}>
              <img className="endWidth" src={card} />
              {/* <img className="endWidth" src={cronjLogo} /> */}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
export default CrypterEnd;
