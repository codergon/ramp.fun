import { Link } from "react-router-dom";
import "./successToast.scss";
import { truncate } from "utils/HelperUtils";

interface MyObject {
  mainMessage: string;
  subMessage: string;
}

const SuccessToast = (data: {message: string, hash: string | undefined, url: string | undefined}) => {
  return (
    <div className="success-toast-wrapper">
      <div className="success-img-wrapper">
        <img src="./assets/images/successTick.png" alt="" />
      </div>
      <div className="success-message">
        <h2>{data.message}!</h2>
        <a target="_blank" href={data.url ? data.url : ""}><p>Txn Hash </p> {truncate(data.hash)}</a>
      </div>
    </div>
  );
};

export default SuccessToast;
