import "./home.scss";
import { NavLink } from "react-router-dom";
import { ArrowLeft, ArrowRight, CaretDoubleRight } from "@phosphor-icons/react";

import Footer from "components/app/footer";
import SearchbarWithShortcut from "components/common/searchBarWithShortcut";

import { useTokens } from "../../hooks/useToken";
import { useAccount } from "wagmi";
import { fraxtalTestnet } from "viem/chains";
import { truncate } from "utils/HelperUtils";
import EmptyState from "../../components/common/empty-state";
import { formatEther } from "viem";

const Home = () => {
  const { chainId } = useAccount();
  const { tokens, loading, error} = useTokens(chainId ? chainId : fraxtalTestnet.id, "timestamp", 10);

  return (
    <>
      <div className="home">
        <div className="home-header">
          <h3 className="home-header__main">
            Free presale Rekt? <br /> Not on our watch!⚡️
          </h3>

          <NavLink to={"/create-token"} className="create-token-btn">
            <p>Launch a new token</p>
            <CaretDoubleRight size={20} weight="bold" />
          </NavLink>
        </div>

        {/* TOKENS */}
        <div className="tokens-list">
          <div className="tokens-topbar">
            <SearchbarWithShortcut />

            {/* NAV */}
            <div className="nav">
              <button className="nav-btn" data-active={!true}>
                <ArrowLeft size={16} weight="bold" />
              </button>

              <div className="nav-number">1</div>

              <button className="nav-btn" data-active={true}>
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </div>
          {
            loading 
            ?
            <EmptyState />
            :
            <div className="tokens-grid">
              {tokens
                .map((token, index) => {
                  return (
                    <NavLink key={index} className="token" to={`/${token.id}`}>
                      <div className="token-image">
                        <img
                          src={
                            token.logoUrl.slice(0, 5) == "https" ?
                            token.logoUrl :
                            `./assets/images/${((index + 1) % 6) + 1}.jpg`
                          }
                          alt=""
                        />
                      </div>

                      <div className="token-details">
                        <div className="token-details--info">
                          <div className="name">{token.name} (ticker: {token.symbol})</div>

                          <div className="stats">
                            <div className="stat">
                              <div className="label">market cap</div>
                              <div className="value market-cap">{formatEther(BigInt(token.marketCap))} ETH</div>
                            </div>
                            •
                            <div className="stat">
                              <div className="label">created by</div>
                              <div className="value">{truncate(token.creator)}</div>
                            </div>
                          </div>

                          <div className="description">
                            {token.description}
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  );
                })}
            </div>
          }
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
