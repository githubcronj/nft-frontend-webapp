import React from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useSWR from "swr";
import { formatEther } from "ethers/lib/utils";

export const Balance = () => {
  const fetcher =
    (library: any) =>
    (...args: any) => {
      const [method, ...params] = args;
      console.log(method, params);
      return library[method](...params);
    };
  const { account, library } = useWeb3React<Web3Provider>();
  const { data: balance } = useSWR(["getBalance", account, "latest"], {
    fetcher: fetcher(library),
  });

  // console.log("Balance --> ", balance);
  if (!balance) {
    return <div>Not Available</div>;
  }
  return <div>{parseFloat(formatEther(balance)).toPrecision(4)} ETH</div>;
};
// export default Balance;
