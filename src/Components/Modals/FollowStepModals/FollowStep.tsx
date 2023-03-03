import { useState } from "react";
import { Typography, Box, Button, styled } from "@mui/material";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import cross from "../../../Assets/images/cross.svg";
import ArrowRightAltSharpIcon from "@mui/icons-material/ArrowRightAltSharp";
import pencil from "../../../Assets/images/pencil.svg";
import upload from "../../../Assets/images/upload.svg";
import bag from "../../../Assets/images/bag.svg";
import greentick from "../../../Assets/images/greentick.svg";
import ButtonComponent from "../../../Common/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    p: true;
  }
}

interface followStepsprops {
  value?: number;
  children?: JSX.Element | JSX.Element[] | string[];
  head?: string;
  subhead1?: string;
  subhead2?: string;
  subhead3?: string;
  smalltext1?: string;
  smalltext2?: string;
  smalltext3?: string;
  viewItem?: boolean;
  submitFile?: any;
  uploadToIPFS?: any;
  createNFT?: any;
  error?: any;
  reset?: any;
}

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  bgcolor: "background.paper",
  p: 2,
  px: 3,
  pb: 3,
  backgroundColor: "#FCFCFD",
  borderRadius: "10px",
};

const FollowStep = (props: followStepsprops) => {
  const [price, setPrice] = useState("");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    props.reset();
  };

  const [style1, setStyle1] = useState("startnowbtn");
  const [style2, setStyle2] = useState("startnowbtn");
  const [style3, setStyle3] = useState("startnowbtn");

  const [active1, setActive1] = useState<boolean>(true);
  const [active2, setActive2] = useState<boolean>(true);
  const [active3, setActive3] = useState<boolean>(true);

  const [buttonText1, setButtonText1] = useState<string>("start");
  const [buttonText2, setButtonText2] = useState<string>("start");
  const [buttonText3, setButtonText3] = useState<string>("start");
  const [loading, setLoading] = useState<boolean>(false);

  const profileUpdated = (toastHandler = toast) => {
    toastHandler.success("NFT Created Successfully!", {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
  };
  const handleClick1 = async () => {
    setActive1(false);
    setLoading(true);
    await props.uploadToIPFS();
    setStyle1("mybtn");
    setButtonText1("done");
    setLoading(false);
  };
  const handleClick2 = async () => {
    setLoading(true);
    setActive2(false);
    await props.createNFT();
    setStyle2("mybtn");
    setButtonText2("done");
    setLoading(false);
    setTimeout(() => {
      profileUpdated();
      navigate("/profile-page", { replace: true });
    }, 1000);
  };
  const handleClick3 = () => {
    setStyle3("mybtn");
    setActive3(false);
    setButtonText3("done");
  };
  return (
    <>
      {/* {props.viewItem ? (
        <ButtonComponent
          customStyle={{ display: "flex", alignItem: "center" }}
          handleClick={handleOpen}
          btnColor={"#3772FF"}
          classNames="btnStyle1 width300 widthP"
        >
          Create items
        </ButtonComponent>
      ) : (
        <Button
          onClick={handleOpen}
          className="px-4 me-3 rounded-pill startnowbtn"
        >
          I Understand, continue
        </Button>
      )} */}

      <StyledModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        BackdropComponent={Backdrop}
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" gutterBottom component="div">
              {props.head ? props.head : "Follow steps"}
            </Typography>
            <img
              className="crossimg"
              src={cross}
              alt="img"
              onClick={handleClose}
            />
          </Box>
          {props.error && <div style={{ color: "red" }}>{props.error}</div>}
          <Box
            sx={{
              display: "flex",
              marginTop: "35px",
            }}
          >
            {active1 ? (
              <img src={upload} alt="img" />
            ) : (
              <img src={greentick} alt="img" />
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "30px",
              }}
            >
              <Typography component="div" variant="h6" className="subhead">
                {props.subhead1 ? props.subhead1 : "Upload file"}
              </Typography>
              <Typography
                component="div"
                className="subtext"
                color="text.secondary"
              >
                {" "}
                {props.smalltext1
                  ? props.smalltext1
                  : "     Click start now to upload"}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Button
              className={style1}
              disabled={active1 === false ? true : false}
              onClick={handleClick1}
            >
              {!active1 && loading ? "In Progress" : buttonText1}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              marginTop: "35px",
            }}
          >
            {active2 ? (
              <img src={pencil} alt="img" />
            ) : (
              <img src={greentick} alt="img" />
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "30px",
              }}
            >
              <Typography component="div" variant="h6" className="subhead">
                {props.subhead2 ? props.subhead2 : "Create NFT"}
              </Typography>
              <Typography
                component="div"
                color="text.secondary"
                className="subtext"
              >
                {" "}
                {props.smalltext2
                  ? props.smalltext2
                  : "   Click start now to proceed"}
              </Typography>
            </Box>
          </Box>
          {/* Need to add here */}
          <Button
            className={style2}
            onClick={handleClick2}
            disabled={buttonText1 === "done" && !props.error ? false : true}
          >
            {!active2 && loading ? "In Progress" : buttonText2}
          </Button>

          {/* <Box
            sx={{
              display: "flex",
              marginTop: "35px",
            }}
          >
            {active3 ? (
              <img src={bag} alt="img" />
            ) : (
              <img src={greentick} alt="img" />
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "30px",
              }}
            >
              <Typography component="div" variant="h6" className="subhead">
                {props.subhead3 ? props.subhead3 : " Sign lock order"}
              </Typography>
              <Typography
                component="div"
                color="text.secondary"
                className="subtext"
              >
                {props.smalltext3
                  ? props.smalltext3
                  : " Sign sell order using your wallet"}
              </Typography>
            </Box>
          </Box>
          <Button onClick={handleClick3} className={style3}>
            {buttonText3}
          </Button> */}
        </Box>
      </StyledModal>
    </>
  );
};

export default FollowStep;
