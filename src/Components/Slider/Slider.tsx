import { Container, Slider, Typography, Box } from "@mui/material";
import "./slider.css";

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    p: true;
  }
}

function valuetext(value: number) {
  return `${value}ETH`;
}
interface sliderprops {
  value?: number;
  children?: string[];
  title?: string;
  ETH1?: string | number;
  ETH2?: string | number;
  modalhead?: string;
  filterPrice?: any;
  price?: any;
}

const SliderComponent = (props: sliderprops) => {
  return (
    <>
      <Container>
        <Box sx={{ width: "100%", padding: "5px 0px" }}>
          <Typography
            variant="subtitle2"
            component="span"
            className="dropdownLabel"
          >
            {props.title ? props.title : "PRICE RANGE"}
          </Typography>
          <Slider
            sx={{
              width: "100%",
              height: "5px",
            }}
            defaultValue={0}
            aria-label="Default"
            valueLabelDisplay="auto"
            valueLabelFormat={valuetext}
            onChange={(e: any) => props.filterPrice(e.target.value)}
            min={0}
            max={100}
            step={2}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography className="sliderText">
              {props.ETH1 ? props.ETH1 : "0.0ETH"}{" "}
            </Typography>
            <Typography className="sliderText">
              {props.ETH2 ? props.ETH2 : "100ETH"}
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};
export default SliderComponent;
