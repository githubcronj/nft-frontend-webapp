import { FC, useState, useContext } from "react";
import "./WalletCard.css";
import smallImg from "../../Assets/images/smallImg.svg";
import {
  Container,
  Switch,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
} from "@mui/material";
import frame from "../../Assets/images/frame.svg";
import menu1 from "../../Assets/images/menu1.svg";
import btn3icon from "../../Assets/images/btn3icon.svg";
import btn4icon from "../../Assets/images/btn4icon.svg";
import btn2icon from "../../Assets/images/btn2icon.svg";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import LocalStorage from "../LocalStorage/LocalStorage";
import { Web3Provider } from "@ethersproject/providers";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useAppSelector } from "../../redux/hooks";
import { useAddress, useDisconnect } from "@thirdweb-dev/react";

const styles = {
  borderRadius: "25px",
  color: "black",
  border: "2px solid #E6E8EC",
};
const styles1 = {
  color: "#ffffff",
  backgroundColor: "#3772FF",
  borderRadius: "25px",
  border: "2px solid #E6E8EC",
};

interface walletcardProps {
  title?: string;
  name?: string;
  password?: string;
  ETH?: string | number;
  img?: string;
}
interface wall {
  setConnected?: any;
  title?: string;
  name?: string;
  password?: string;
  ETH?: string | number;
  img?: string;
}
const WalletCard: FC<wall> = (props) => {
  const userData = useAppSelector((state) => state.userData);
  const address = useAddress();
  const [walletName, setWalletName] = LocalStorage("walletName", "");
  const { activate, deactivate } = useWeb3React<Web3Provider>();
  const [open, setOpen] = useState<boolean>(false);
  const [hover, setHover] = useState<boolean>(false);
  // const { setCurrentAccount } = useContext(NFTMarketplaceContext);
  const disconnect = useDisconnect();

  const handleDisconnect = (status: any) => {
    props.setConnected(status);
    setWalletName("");
    deactivate();
  };
  const handleMouseIn = () => {
    setHover(true);
  };

  const handleMouseOut = () => {
    setHover(false);
  };

  return (
    <>
      <Container>
        <Card sx={{ width: "300px", border: "none", boxShadow: "none" }}>
          <CardContent>
            {/* <Typography variant="h5" className="marginRight" component="div">
              {userData?.name ? userData?.name : "Not Available"}
            </Typography> */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Typography
                sx={{ fontSize: "14px", fontWeight: "bold" }}
                color="text.secondary"
                gutterBottom
              >
                {address ? address.substring(0, 29) + "..." : "Not Available"}
              </Typography>

              {/* <img src={smallImg} alt="img" width={"15px"} className="pswimg" /> */}
            </Box>
            {/* <Card
              sx={{
                boxShadow: "0px 7px 5px 6px #0F0F0F1A",
                borderRadius: "15px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "250px",
                }}
              >
                <img src={frame} alt="img" width={"70px"} />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent
                    sx={{
                      flex: "1 0 auto",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      component="div"
                      className="text1"
                    >
                      {props.title ? props.title : "Balance"}
                    </Typography>
                    <Typography
                      component="div"
                      variant="h5"
                      fontWeight={"bold"}
                    >
                      {props.ETH ? props.ETH : "999.98"} ETH
                    </Typography>
                  </CardContent>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",

                  marginBottom: "10px",
                }}
              >
                <Button
                  onMouseOver={handleMouseIn}
                  onMouseOut={handleMouseOut}
                  style={hover ? styles1 : styles}
                >
                  Manage funds on MetaMask
                </Button>
              </Box>
            </Card> */}

            <Link to="/profile-page" className="linkUnderline">
              <Box
                className="wrapper"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #777E90",
                  padding: "10px 0px",
                  marginTop: "15px",
                }}
              >
                <img src={menu1} alt="img" className="menu_img" />

                <Typography
                  color="text.secondary"
                  component="div"
                  className="btntext"
                >
                  My profile
                </Typography>
              </Box>
            </Link>
            <Link to="/item" className="linkUnderline">
              <Box
                className="wrapper"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #777E90",
                  padding: "10px 0px",
                }}
              >
                <img className="menu_img" src={btn2icon} alt="img" />
                <Typography
                  color="text.secondary"
                  component="div"
                  className="btntext"
                >
                  My items
                </Typography>
              </Box>
            </Link>
            <Box
              className="wrapper"
              sx={{
                display: "flex",

                justifyContent: "space-between",
                borderBottom: "1px solid #777E90",
                padding: "10px 0px",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <img src={btn3icon} alt="img" width={"20px"} />
                <Typography
                  color="text.secondary"
                  component="div"
                  className="btntext4"
                >
                  Dark theme
                </Typography>
              </Box>

              <Box>
                <Switch />
              </Box>
            </Box>
            <Box
              className="wrapper"
              sx={{
                display: "flex",
                alignItems: "center",

                padding: "10px 0px",
              }}
            >
              <img className="menu_img" src={btn4icon} alt="img" />
              <Typography
                color="text.secondary"
                component="div"
                className="btntext"
                onClick={() => handleDisconnect(false)}
              >
                Disconnect
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};
export default WalletCard;
