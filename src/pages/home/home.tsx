import "./home.scss";
import { NavLink } from "react-router-dom";
import { ArrowLeft, ArrowRight, CaretDoubleRight } from "@phosphor-icons/react";

import Footer from "components/app/footer";
import SearchbarWithShortcut from "components/common/searchBarWithShortcut";

const Home = () => {
  return (
    <>
      <div className="home">
        <div className="home-header">
          <h3 className="home-header__main">
            Secure, Fair-Launch <br /> Crypto Investments
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

          <div className="tokens-grid">
            {Array(14)
              .fill(0)
              .map((token, index) => {
                return (
                  <NavLink key={index} className="token" to={`/hbjhhj`}>
                    <div className="token-image">
                      <img
                        src={`./assets/images/${((index + 1) % 6) + 1}.jpg`}
                        alt=""
                      />
                    </div>

                    <div className="token-details">
                      <div className="token-details--info">
                        <div className="name">PepeBox (ticker: PEPEBOX)</div>

                        <div className="stats">
                          <div className="stat">
                            <div className="label">market cap</div>
                            <div className="value market-cap">23.4k</div>
                          </div>
                          •
                          <div className="stat">
                            <div className="label">created by</div>
                            <div className="value">Schwarzy</div>
                          </div>
                        </div>

                        <div className="description">
                          Pepe in a legendary boxing fight with where, these
                          cryptos are very strong, the one who wins the fight
                          for wins in solana.
                        </div>
                      </div>
                    </div>
                  </NavLink>
                );
              })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
