import "./topbar.scss";
import { useWindowSize } from "react-use";
import { truncate } from "utils/HelperUtils";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import WalletIcon from "components/common/wallet-icon";
import { useAccount, useEnsAvatar, useEnsName, useSwitchChain, useDisconnect, useChainId } from "wagmi";
import { ArrowUpRight, Eye, WaveSine } from "@phosphor-icons/react";
import { useState } from "react";

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
  const { chains, switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [showNetworkDrop, setShowNetworkDrop] = useState(false);
  const currentChain = useChainId();

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
                    <p>0xfe3...4fc bought 10 RAMP</p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="c-topbar">
        <a href="/">
          <div className="c-topbar__logo">
            ramp.fun
            <div className="icon">
              <WaveSine size={28} weight="bold" mirrored />
            </div>
          </div>
        </a>

        <div className="c-topbar__block">
          {address && (
            <div
              onMouseEnter={() => setShowNetworkDrop(true)}
              onMouseLeave={() => setShowNetworkDrop(!showNetworkDrop)}
              className="frax-network"
            >
              <button className="logo">
                <img
                  className=""
                  src="./assets/images/frax.png"
                  alt="frax-logo"
                />
              </button>
              {showNetworkDrop && (
                <div className="dropdown-wrapper">
                  <div className="dropdown-container">
                    {
                      chains.map((chain) => (
                        <button
                          key={chain.id}
                          disabled={currentChain == chain.id ? true : false}
                          onClick={() => {
                            switchChain({ chainId: chain.id as 252 | 2522 })
                            setShowNetworkDrop(false);
                          }}
                          className="border-bottom"
                          style={currentChain == chain.id ? {background: "#333"} : {}}
                        >
                          {chain.name}
                        </button>
                      ))
                    }
                    <button
                      onClick={() => {
                        disconnect();
                        setShowNetworkDrop(false);
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

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

              <a target="_blank" href="">
                <p>TW</p>
                <ArrowUpRight size={14} weight="bold" />
              </a>

              <a target="_blank" href="">
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
