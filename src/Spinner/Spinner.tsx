import React from "react";
import { Hearts, Rings, ThreeDots } from "react-loader-spinner";
import { Watch } from "react-loader-spinner";
import "./Spinner.css";

const Spinner = ({ message }: {message: any}) => {
  return (
    <div className="main">
      <Rings color="blue" ariaLabel="loading-indicator" />
      <p className="text">{message}</p>
    </div>
  );
};



export default Spinner;
