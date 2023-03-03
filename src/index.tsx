import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
// import { TransactionProvider } from "./context/Transaction";
import { Provider } from "react-redux";
import store from "./redux/store";
// import { NFTMarketplaceProvider } from "./context/NFTMarketplaceContext";
import { NFTMarketplaceProvider } from "../src/context/NFTMarketplaceContext";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import netowork from "./utils/netowork";
//dark theme starts here
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

ReactDOM.render(
  <Provider store={store}>
    {/* Context  */}
    <NFTMarketplaceProvider>
      <BrowserRouter>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ThirdwebProvider desiredChainId={netowork}>
            <App />
          </ThirdwebProvider>
        </Web3ReactProvider>
      </BrowserRouter>
    </NFTMarketplaceProvider>
  </Provider>,

  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
