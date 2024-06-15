import "./topbar.scss";
import { useModal } from "contexts";
import { Eye, GasPump, Plus } from "@phosphor-icons/react";
import dayjs from "dayjs";

const Topbar = () => {
  [];

  return (
    <div className="c-topbar">
      <div className="c-topbar__connect">
        {/* <div className="c-button c-button--border c-button--rounded">
          Connect wallet
        </div> */}
        <w3m-account-button />
      </div>

      <div className="c-topbar__btns">
        <p>
          {dayjs()
            .tz("America/New_York")
            .format("dddd, MMMM D, [New York,] HH:mm")}
        </p>
        <div className="gas-price c-topbar__btn">
          <GasPump size={18} weight="fill" />
          <p>24 GWEI</p>
        </div>

        {/* <div className="gas-price c-topbar__btn">
          <Eye size={18} weight="bold" />
        </div> */}
      </div>
    </div>
  );
};

export default Topbar;
