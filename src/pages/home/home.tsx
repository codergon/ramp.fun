import "./home.scss";
import SearchbarWithShortcut from "components/common/searchBarWithShortcut";

import { ArrowLeft, ArrowRight, CaretDoubleRight } from "@phosphor-icons/react";

const Home = () => {
  return (
    <div className="home">
      <div className="home-header">
        <h3 className="home-header__main">
          Secure, Fair-Launch <br /> Crypto Investments
        </h3>

        {/* <p className="home-header__sub">
          Explore the most popular digital collectibles on XRP
        </p> */}

        <div className="create-token-btn">
          <p>Launch a new token</p>
          <CaretDoubleRight
            size={20}
            weight="bold"
            // style={{ marginTop: "4px" }}
          />
        </div>
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
                <div key={index} className="token">
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
                        cryptos are very strong, the one who wins the fight for
                        wins in solana.
                      </div>
                    </div>
                  </div>

                  {/* <div className="token-image">
                  <img
                    src={`./assets/images/${((index + 1) % 6) + 1}.jpg`}
                    alt=""
                  />
                </div> */}
                </div>
              );
            })}

          {/* <div className="token load-more"></div> */}
        </div>
      </div>
      {/* TRENDING PROJECTS */}
      <div className="trending">
        {[1, 2].map((item, projectsIndex) => {
          return (
            <div
              key={projectsIndex}
              className={`trending-projects trending-projects--row${projectsIndex + 1}`}
            >
              <div className="trending-projects--inner">
                {Array(14)
                  .fill(0)
                  .map((project, index) => {
                    return (
                      <div key={index} className="project">
                        <img
                          src={`./assets/images/illustrations/${((index + 1) % 6) + 1}.webp`}
                          alt=""
                        />
                        <p>Alpha$ bought 0.0026 SOL of PUMP</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
