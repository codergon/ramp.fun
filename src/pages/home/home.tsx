import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      {/*  */}
      {/*  */}

      <div className="tokens-grid">
        {Array(10)
          .fill(0)
          .map((token, index) => {
            return (
              <div key={index} className="token">
                <div className="token-image">
                  {/* <img src={`./assets/images/1.jpg`} alt="" /> */}
                </div>
              </div>
            );
          })}
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
                          src={`./assets/images/illustrations/${(index + 1) % 6}.webp`}
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
