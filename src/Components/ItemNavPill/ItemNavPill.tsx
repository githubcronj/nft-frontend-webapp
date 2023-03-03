import { FC } from "react";
import "./navpill.css";
import { Divider, Typography, Box, Grid } from "@mui/material";
import { ethers } from "ethers";
import { NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import netowork from "../../utils/netowork";
import ButtonComponent from "../../Common/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
interface navPill {
  itemsDetails: any;
  cardData: any;
  acceptOffer: any;
  listingId: any;
  contract: any;
}
const ItemNavPill: FC<navPill> = ({
  itemsDetails,
  cardData,
  acceptOffer,
  listingId,
  contract,
}) => {
  console.log("OFFER IN OFFERS --> ", itemsDetails);
  const navigate = useNavigate();
  console.log("Listing Id in Accept offer -> ", listingId);
  const acceptOfferHandler = async () => {
    console.log("ACCEPT OFFER -> ", listingId, itemsDetails?.offeror);
    await acceptOffer(
      {
        listingId,
        addressOfOfferor: itemsDetails?.offeror,
      },
      {
        onSuccess(data: any, variables: any, context: any) {
          // alert("Offer accepted successfully!");
          toast.success("Offer made successfully!", {
            style: {
              background: "#04111d",
              color: "#fff",
            },
          });
          console.log("SUCCESS : ", data, variables, context);
          navigate("/home");
        },

        onError(data: any, variables: any, context: any) {
          // alert("Sorry, offer could not be accepted!");
          toast.error("Sorry, offer could not be accepted!", {
            style: {
              background: "#04111d",
              color: "#fff",
            },
          });
          console.log("ERROR : ", data, variables, context);
          navigate("/home");
        },
      }
    );
  };
  return (
    // <Box>
    //   <Box
    //     sx={{
    //       display: "flex",
    //       flexDirection: "row",
    //       justifyContent: "space-between",
    //       marginTop: "10px",
    //     }}
    //   >
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "row",
    //         alignItems: "center",
    //       }}
    //     >
    //       <Box sx={{ marginRight: "10px" }}>
    //         <img src={itemsDetails.profile} alt="profile" width={45} />
    //       </Box>
    //       {itemsDetails.badge ? (
    //         <img src={itemsDetails.badge} alt="badge" className="badge" />
    //       ) : null}

    //       <Box>
    //         {itemsDetails.Designation ? (
    //           <Typography
    //             variant="subtitle2"
    //             component="div"
    //             sx={{ color: "#777E90", fontSize: "14px" }}
    //           >
    //             {itemsDetails.Designation}
    //           </Typography>
    //         ) : itemsDetails.highestBidETH ? (
    //           <Typography
    //             variant="subtitle2"
    //             component="div"
    //             sx={{ color: "#777E90", fontSize: "14px" }}
    //           >
    //             Highest Offer:{" "}
    //             <span
    //               style={{
    //                 fontSize: "14px",
    //                 color: "#23262F",
    //                 fontWeight: "600",
    //               }}
    //             >
    //               {itemsDetails.offeror} ETH
    //             </span>
    //           </Typography>
    //         ) : itemsDetails.offeror ? (
    //           <Typography
    //             variant="subtitle2"
    //             component="div"
    //             sx={{ color: "#23262F", fontSize: "14px", fontWeight: "600" }}
    //           >
    //             {itemsDetails.offeror}
    //           </Typography>
    //         ) : null}

    //         {itemsDetails.artName ? (
    //           <Typography
    //             variant="subtitle2"
    //             gutterBottom
    //             component="div"
    //             sx={{ fontSize: "13px", color: "#777E90" }}
    //           >
    //             Put{" "}
    //             <span style={{ color: "#23262F", fontWeight: "600" }}>
    //               {itemsDetails.artName}
    //             </span>{" "}
    //             on sale
    //           </Typography>
    //         ) : itemsDetails.acceptedBidName ? (
    //           <Typography
    //             variant="subtitle2"
    //             gutterBottom
    //             component="div"
    //             sx={{ fontSize: "12px", color: "#777E90" }}
    //           >
    //             Accepted{" "}
    //             <span style={{ color: "#23262F", fontWeight: "600" }}>
    //               {itemsDetails.acceptedBidName}{" "}
    //             </span>
    //             's bid
    //           </Typography>
    //         ) : itemsDetails.PlaceBid_ETH ? (
    //           <Typography
    //             variant="subtitle2"
    //             gutterBottom
    //             component="div"
    //             sx={{ fontSize: "14px", color: "#777E90" }}
    //           >
    //             Make an Offer:{" "}
    //             <span style={{ color: "#45B26B", fontWeight: "600" }}>
    //               {itemsDetails.PlaceBid_ETH} ETH
    //             </span>
    //           </Typography>
    //         ) : itemsDetails.Name ? (
    //           <Typography
    //             variant="subtitle2"
    //             gutterBottom
    //             component="div"
    //             sx={{
    //               fontSize: "14px",
    //               color: "#23262F",
    //               fontWeight: "600",
    //             }}
    //           >
    //             {itemsDetails.Name}
    //             {cardData.owner}
    //           </Typography>
    //         ) : null}
    //       </Box>
    //     </Box>
    //     <Box>
    //       {itemsDetails.DateTime ? (
    //         <Typography
    //           variant="subtitle2"
    //           gutterBottom
    //           component="div"
    //           sx={{ fontSize: "11px", color: "#777E90" }}
    //         >
    //           Jun 14 - 4:12 PM
    //         </Typography>
    //       ) : null}
    //     </Box>
    //   </Box>
    //   <Divider light sx={{ margin: "5px 0px" }} />
    // </Box>
    <>
      <Grid
        container
        spacing={5}
        sx={{
          width: "370px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={6}>
          <Typography fontWeight="bold">Offeror: </Typography>
          <Typography>
            {itemsDetails?.offeror.slice(0, 5) +
              "..." +
              itemsDetails?.offeror.slice(-5)}
          </Typography>

          <Typography fontWeight="bold">Offered Amount: </Typography>
          <Typography>
            {ethers.utils.formatEther(itemsDetails?.totalOfferAmount)}
            {NATIVE_TOKENS[netowork].symbol}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <ButtonComponent
            customStyle={{ padding: "10px" }}
            btnColor={"#3772FF"}
            // classNames="scrollbarOffer"
            handleClick={acceptOfferHandler}
          >
            Accept Offer
          </ButtonComponent>
        </Grid>
      </Grid>

      <hr />
    </>
  );
};

export default ItemNavPill;
