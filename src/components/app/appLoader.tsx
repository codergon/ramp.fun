import { Infinity } from "@phosphor-icons/react";

const AppLoader = ({ message = "" }) => {
  return (
    <div className="app-loader">
      <Infinity size={100} weight="light" />

      {message && <p>{message}</p>}
    </div>
  );
};

export default AppLoader;
