import "./token.scss";
import { useParams } from "react-router-dom";

const TokenPage = () => {
  const { token } = useParams();

  return <div className="token-page">Token: {token}</div>;
};

export default TokenPage;
