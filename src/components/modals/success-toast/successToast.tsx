import React from "react";
import "./successToast.scss";

interface MyObject {
  mainMessage: string;
  subMessage: string;
}

// Define the props for the component
// interface ChildComponentProps {
//   myObject: MyObject;
// }
const SuccessToast = ({ swapSuccessMessages: {} }) => {
  return (
    <div className="success-toast-wrapper">
      <div className="success-img-wrapper">
        <img src="./assets/images/successTick.png" alt="" />
      </div>
      <div className="success-message">
        <h2>Swap Successful!</h2>
        <p>Successfuly swapped 2ETH for 2000 DEez</p>
      </div>
    </div>
  );
};

export default SuccessToast;
