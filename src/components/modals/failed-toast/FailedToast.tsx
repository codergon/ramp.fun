import React from "react";
import "./FailedToast.scss";

interface MyObject {
  mainMessage: string;
  subMessage: string;
}

// Define the props for the component
// interface ChildComponentProps {
//   myObject: MyObject;
// }
const FailedToasts = () => {
  return (
    <div className="failed-toast-wrapper">
      <div className="failed-img-wrapper">
        <img src="./assets/images/failed.png" alt="" />
      </div>
      <div className="failed-message">
        <h2>Operation Failed!</h2>
        <p>We couldn't process your transaction</p>
      </div>
    </div>
  );
};

export default FailedToasts;
