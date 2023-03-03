import { useState, useEffect, FC, useContext } from "react";
import {
  Container,
  Typography,
  Box,
  Divider,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import "./ConnectWallet.css";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import WalletName from "./WalletName";
import Right from "../../Assets/images/Righticon.svg";
import icon1 from "../../Assets/images/icon1.svg";
import icon2 from "../../Assets/images/icon2.svg";
import icon4 from "../../Assets/images/icon3.svg";
import { Link, useNavigate } from "react-router-dom";
import QR from "../../Assets/images/QRCode.png";
import QR1 from "../../Assets/images/QRCode1.svg";
import Wallet from "../../Assets/images/Wallet.png";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";
// import detectEthereumProvider from "@metamask/detect-provider";
import { useWeb3React } from "@web3-react/core";
import { connectorInfo } from "./Connectors";
import { Web3Provider } from "@ethersproject/providers";
import { useDispatch } from "react-redux";
import { setAddress } from "../../redux/slices/UserSlice";
import LocalStorage from "../../Components/LocalStorage/LocalStorage";
import { NFTMarketplaceContext } from "../../context/NFTMarketplaceContext";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import toast from "react-hot-toast";

interface wallet {
  setConnected?: any;
}

export const ConnectWallet: FC<wallet> = ({ setConnected }) => {
  const connectWithMetaMask = useMetamask();
  const disconnect = useDisconnect();
  const address = useAddress();
  console.log(address, "-----------------------------ADDRESS");

  const [Display, setDisplay] = useState(true);
  const [CImg, setCImg] = useState(false);
  const [Dnone, setDnone] = useState(false);
  const [showB, setshowB] = useState(true);
  const [errorMessage, setErrorMessage] = useState<any>("");
  const [walletName, setWalletName] = LocalStorage("walletName", "");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    activate,
    deactivate,
    account,
    active,
    connector,
    chainId,
    library: provider,
    error,
  } = useWeb3React<Web3Provider>();

  console.log("Provider --> ", provider, window.ethereum);

  const handleButtonClick = (status: any) => {
    setConnected(status);
  };

  // if(setConnected == true){
  //   dispatch(setAddress({address:account}))
  // }
  const handle1 = () => {
    // setDisplay(false);
    // setDnone(false);
    // activate(Injected);
    // localStorage.setItem("address", account);
    // localStorage.setItem("address", JSON.stringify(account));
  };

  const handle2 = () => {
    // setCImg(true);
    // activate(CoinbaseWallet);
  };

  const displayBlock = () => {
    setDnone(true);
    setDisplay(true);
    setshowB(false);
  };

  // useEffect(() => {
  //   if (account) {
  //     console.log("useffect", account);
  //     setConnected(true);
  //     dispatch(setAddress({ address: account }));
  //     navigate("/home");
  //   }
  // }, [account]);

  useEffect(() => {
    const { ethereum } = window;
    if (!ethereum) {
      toast("Please install MetaMask Extentions", {
        style: {
          background: "#04111d",
          color: "#fff",
        },
      });
    }
  }, []);
  // Smart contract
  // const { connectWallet } = useContext(NFTMarketplaceContext);

  return (
    <>
      <Container>
        <Box>
          <Typography className="styleHead">
            <Link to="/connect-wallet" className="linkUnderline">
              <span className="marginC1">
                {" "}
                <KeyboardBackspaceIcon></KeyboardBackspaceIcon>
              </span>
            </Link>
            Connect your wallet
          </Typography>
          <Divider />
        </Box>
        <Grid
          container
          sx={{ margin: "50px 0px", display: "flex", alignItems: "center" }}
        >
          <Grid item md={6} sm={6} xs={12}>
            <Box>
              <WalletName
                title="MetaMask wallet"
                // onClick={() => {
                //   activate(connectorInfo.metaMask, (err: any) => {
                //     if (err) return setErrorMessage(err);
                //   });
                //   setWalletName("metamask");
                // }}
                onClick={connectWithMetaMask}
              />
              {/* <WalletName
                title="Coinbase wallet"
                img={icon1}
                Cimg={Right}
                onClick={() => {
                  activate(connectorInfo.coinbaseWallet, (err: any) => {
                    if (err) return setErrorMessage(err);
                  });
                  setWalletName("coinbase");
                }}
              /> */}
              {/* <WalletName
                title="Wallet Connect"
                img={icon4}
                onClick={() => {
                  activate(connectorInfo.walletConnect, (err: any) => {
                    if(err) return setErrorMessage(err);
                    setWalletName('walletconnect')
                  });
                }}
              /> */}
            </Box>
          </Grid>
          <Grid item md={5} sm={6} xs={12}>
            {!!error && <h4>{error.message}</h4>}
            {/* {active && (<Grid item container>
                <Grid item>{account}</Grid>
                <Button onClick={()=>{
                  deactivate()
                }}>Deactivate</Button>
            </Grid>)
            } */}
            {Display ? (
              <Box
                sx={{ display: showB ? "block" : "none" }}
                className="DNone "
              >
                <img className="imgC1 maxWidth" src={QR} />
              </Box>
            ) : (
              <Box className="CNone padding300">
                <Typography className="fontC2">Scan to connect</Typography>
                <Typography className="fontC3">
                  Powered by UI8.Wallet
                </Typography>
                <img src={QR1} className="maxWidth" />
                <Box sx={{ margin: "10px 0px" }}>
                  <ButtonComponent
                    btnColor={"#23262F"}
                    styleType={"outline"}
                    classNames="changeDo"
                    handleClick={displayBlock}
                  >
                    Don't have wallet app?
                  </ButtonComponent>
                </Box>
              </Box>
            )}

            {Dnone ? (
              <Box className="padding300">
                <Typography className="fontC2">Terms of Service</Typography>
                <Typography className="fontC3">
                  Please take a few minutes to read and understand{" "}
                  <span className="colorB">Stacks Terms of Service</span>. To
                  continue, you’ll need to accept the terms of services by
                  checking the boxes.
                </Typography>
                <img src={Wallet} className="maxWidth" />
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="I am at least 13 year old"
                  />
                  <FormControlLabel
                    control={<Checkbox />}
                    label="I agree Stack terms of service"
                  />
                </FormGroup>
                <Box sx={{ margin: "20px 0px" }}>
                  <ButtonComponent
                    styleType={"outline"}
                    btnColor={"#23262F"}
                    classNames="changeWallet1"
                  >
                    cancel
                  </ButtonComponent>
                  <Link to="/home">
                    <ButtonComponent
                      btnColor={"#3772FF"}
                      classNames="changeWallet"
                      handleClick={() => handleButtonClick(true)}
                    >
                      Get started now
                    </ButtonComponent>
                  </Link>
                </Box>
              </Box>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};
