import "./topbar.scss";
import dayjs from "dayjs";
import { useWindowSize } from "react-use";
import { truncate } from "utils/HelperUtils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import WalletIcon from "components/common/wallet-icon";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import { ArrowUpRight, Eye, WaveSine } from "@phosphor-icons/react";

const Topbar = () => {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const { data: ens } = useEnsName({
    address,
    query: { enabled: !!address },
  });
  const { data: avatar } = useEnsAvatar({
    name: ens!,
    query: { enabled: !!ens },
  });

  const { width } = useWindowSize();

  return (
    <>
      <div className="trending">
        <div className="trending-projects">
          <div className="trending-projects--inner">
            {Array(14)
              .fill(0)
              .map((project, index) => {
                return (
                  <div key={index} className="project">
                    <img
                      src={`./assets/images/${((index + 1) % 4) + 1}.jpg`}
                      alt=""
                    />
                    <p>0xfe3...4fc bought 10 PUMP</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="c-topbar">
        <div className="c-topbar__logo">
          ramp.fun
          <div className="icon">
            <WaveSine size={28} weight="bold" mirrored />
          </div>
        </div>

        {/* <p className="time-display">
        {dayjs()
          .tz("America/New_York")
          .format("dddd, MMM D, [New York,] HH:mm")}
      </p> */}
        {/* <SearchbarWithShortcut /> */}

        <div className="c-topbar__block">
          {address ? (
            <div className="acct-display">
              {!!avatar ? (
                <img src={avatar} alt="avatar" />
              ) : (
                <WalletIcon size={22} address={`0x`} />
              )}
              <p>{ens || truncate(address)}</p>
            </div>
          ) : (
            <div className="acct-display" onClick={() => open()}>
              <p>[Connect Wallet]</p>
            </div>
          )}

          {width > 740 && (
            <>
              <div className="divider" />

              {/* <p className="time-display">
                {dayjs().tz("America/New_York").format("[New York,] HH:mm")}
              </p> */}

              <a target="_blank" href="https://twitter.com/thealpha_knight">
                <p>TW</p>
                <ArrowUpRight size={14} weight="bold" />
              </a>

              <a target="_blank" href="https://github.com/codergon/ramp.fun">
                <p>GH</p>
                <ArrowUpRight size={14} weight="bold" />
              </a>

              <div className="gas-price c-topbar__btn">
                <Eye size={18} weight="bold" />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Topbar;
