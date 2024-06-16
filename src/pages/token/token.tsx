import "./token.scss";
import { useParams } from "react-router-dom";

const TokenPage = () => {
  const { token } = useParams();

  return <div>Token: {token}</div>;
};

export default TokenPage;
