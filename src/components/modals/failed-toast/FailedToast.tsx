import "./FailedToast.scss";
import { XCircle } from "@phosphor-icons/react";

const FailedToast = () => {
  return (
    <div className="failed-toast-wrapper">
      <div className="failed-img-wrapper">
        <XCircle color="#ec1e1e" size={50} />
      </div>
      <div className="failed-message">
        <h2>Operation Failed!</h2>
        <p>We couldn't process your transaction.</p>
      </div>
    </div>
  );
};

export default FailedToast;
