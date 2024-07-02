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
    <div className="success-toast-wrapper">
      <div className="success-img-wrapper">
        <img src="./assets/images/failed.png" alt="" />
      </div>
      <div className="success-message">
        <h2>Interraction Failed!</h2>
        <p>We couldn't process your request</p>
      </div>
    </div>
  );
};

export default FailedToasts;
