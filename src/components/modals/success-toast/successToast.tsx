import "./successToast.scss";
import { truncate } from "utils/HelperUtils";
import { CheckCircle } from "@phosphor-icons/react";

const SuccessToast = (data: {
  message: string;
  hash: string | undefined;
  url: string | undefined;
}) => {
  return (
    <div className="success-toast-wrapper">
      <div className="success-img-wrapper">
        <CheckCircle color="#4aba04" size={50} />
      </div>
      <div className="success-message">
        <h2>{data.message}!</h2>
        <a target="_blank" href={data.url ? data.url : ""}>
          <p>Txn Hash </p> {truncate(data.hash)}
        </a>
      </div>
    </div>
  );
};

export default SuccessToast;
