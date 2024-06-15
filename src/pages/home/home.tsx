import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      {/*  */}
      {/*  */}

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
                      Pepe in a legendary boxing fight with where, these cryptos
                      are very strong, the one who wins the fight for wins in
                      solana.
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
