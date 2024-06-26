import TradeRow from "components/common/trades-row/tradeRow";
import "./token.scss";
import { useParams } from "react-router-dom";
import React, { useState } from "react";
import Close from "../../../public/assets/images/Vector.svg";

const trades = [
  {
    type: "Bought",
    time: "5:18pm",
    account: "Schwazy",
    sol: "0.01",
    pepebox: "1.2k",
    date: "July 5,2024",
    transactions: "0xfshua...sgsag",
  },
  {
    type: "Sold",
    time: "5:18pm",
    account: "Schwazy",
    sol: "0.01",
    pepebox: "1.2k",
    date: "July 5,2024",
    transactions: "0xfshua...sgsag",
  },

  {
    type: "Sold",
    time: "5:18pm",
    account: "Schwazy",
    sol: "0.01",
    pepebox: "1.2k",
    date: "July 5,2024",
    transactions: "0xfshua...sgsag",
  },
  {
    type: "Sold",
    time: "5:18pm",
    account: "Schwazy",
    sol: "0.01",
    pepebox: "1.2k",
    date: "July 5,2024",
    transactions: "0xfshua...sgsag",
  },
  {
    type: "Bought",
    time: "5:18pm",
    account: "Schwazy",
    sol: "0.01",
    pepebox: "1.2k",
    date: "July 5,2024",
    transactions: "0xfshua...sgsag",
  },
  {
    type: "Bought",
    time: "5:18pm",
    account: "Schwazy",
    sol: "0.01",
    pepebox: "1.2k",
    date: "July 5,2024",
    transactions: "0xfshua...sgsag",
  },
  {
    type: "Bought",
    time: "5:18pm",
    account: "Schwazy",
    sol: "0.01",
    pepebox: "1.2k",
    date: "July 5,2024",
    transactions: "0xfshua...sgsag",
  },
  {
    type: "Bought",
    time: "5:18pm",
    account: "Schwazy",
    sol: "0.01",
    pepebox: "1.2k",
    date: "July 5,2024",
    transactions: "0xfshua...sgsag",
  },
];

const TokenPage = () => {
  const { token } = useParams();
  const [buyActive, setBuyActive] = useState(true);
  const [sellActive, setSellActive] = useState(false);
  const [showSlippageModal, setShowSlippageModal] = useState(false);

  const toggleBuy = () => {
    setBuyActive(true);
    setSellActive(false);
  };

  const toggleSell = () => {
    setBuyActive(false);
    setSellActive(true);
  };

  const toggleSlippage = () => {
    setShowSlippageModal(!showSlippageModal);
  };
  return (
    <div className="token-page">
      <div className="token-page-wrapper">
        <section className="section1">
          <div className="section1-left">
            <img
              className="tokenImg"
              src="./assets/images/tokenImg1.png"
              alt=""
            />
            <div className="text-wrapper">
              <h2>PepeBox (ticker: PEPEBOX)</h2>
              <p>
                In a legendary boxing match with Pepe and Where, representing
                powerful cryptocurrencies, clash with the arena buzzing with
                excitement and glee. Pepebox has a market size of 23.4k
              </p>
              <div className="creator-details">
                <div className="creator-name">
                  <img src="./assets/images/user.png" alt="" />
                  <p>
                    Created by <span className="schwarzy">Schwarzy</span>
                  </p>
                </div>
                <div className="creator-address">
                  <img src="./assets/images/copy.png" alt="" />
                  <p>0xfshua...sgsag</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section1-right">
            <div className="position">
              <div className=" buy-sell-wrapper">
                <button
                  onClick={toggleBuy}
                  className={buyActive ? "buy activePosition" : "buy"}
                >
                  Buy
                </button>
                <button
                  onClick={toggleSell}
                  className={sellActive ? "sell activePosition" : "sell"}
                >
                  Sell
                </button>
              </div>
              <button onClick={toggleSlippage} className="slippage">
                <img src="./assets/images/settings.png" alt="" />{" "}
                <p>Set max slippage</p>
              </button>
            </div>
            <div className="swap-box">
              <div className="from-token">
                <div>
                  <button className="from-token-btn">
                    <img src="./assets/images/sol.png" alt="" />
                    <p>SOL</p>
                    <img src="./assets/images/arrowDown.png" alt="" />
                  </button>
                </div>
                <div className="amount-wrapper">
                  <input
                    type="number"
                    placeholder="0.0"
                    name="quantity"
                    id="qunatity"
                  />{" "}
                  <p className="wallet-bal-wrapper">
                    <img src="./assets/images/wallet.png " alt="" />
                    <span>0</span>
                  </p>{" "}
                </div>
              </div>
              <button className="switch-token">
                <img src="./assets/images/swap.png" alt="" />
              </button>
              <div className="to-token">
                <div>
                  <button className="from-token-btn">
                    <img src="./assets/images/3 2.png" alt="" />
                    <p>PEPEBOX</p>
                  </button>
                </div>
                <div className="amount-wrapper">
                  <input
                    type="number"
                    placeholder="0.0"
                    name="quantity"
                    id="qunatity"
                  />{" "}
                  <p className="wallet-bal-wrapper">
                    <img src="./assets/images/wallet.png " alt="" />
                    <span>0</span>
                  </p>{" "}
                </div>
              </div>
            </div>
            <button className="trade-btn">Place trade</button>
          </div>
        </section>
        <section className="section2"></section>
        <section className="section3">
          <div className="section3-header">
            <h2>Trades</h2>{" "}
            <div>
              <img className="prev-btn" src="./assets/images/next.png" alt="" />{" "}
              <p>1</p>{" "}
              <img className="next-btn" src="./assets/images/next.png" alt="" />{" "}
            </div>
          </div>
          <div className="trades-table-wrapper">
            <table>
              <tr className="table-header">
                <th className="border-radius1">Type</th>
                <th>Account</th>
                <th>Sol</th>
                <th>Pepebox</th>
                <th>Date</th>
                <th className="border-radius2">Transactions</th>
              </tr>
              {trades.map((trade, index) => (
                <TradeRow key={index} trade={trade} />
              ))}
              {/* <TradeRow /> */}
            </table>
          </div>
        </section>

        {showSlippageModal && (
          <section className="slippage-wrapper">
            <div className="slippage-modal">
              <div className="slippage-header">
                <div className="settings">
                  <h2>Settings</h2>{" "}
                  <button onClick={toggleSlippage} className="close-btn">
                    <img src="./assets/images/close.svg" alt="" />
                  </button>{" "}
                </div>
                <p>Set max spillage and priority fee</p>
              </div>
              <div className="inputs">
                <div className="max-spillage-wrapper">
                  <p>Max Spillage</p>
                  <div className="max-spillage">
                    <input
                      type="number"
                      name="spillage"
                      id="spillage"
                      placeholder="0.0%"
                    />
                  </div>
                </div>
                <div className="priority-fee-wrapper">
                  <p>Priority fee</p>
                  <div className="priority-fee-input">
                    <div>
                      <img src="./assets/images/sol.png" alt="" />
                      <p>SOL</p>
                    </div>{" "}
                    <input
                      type="number"
                      name="priorityFee"
                      id="priorityFee"
                      placeholder="00"
                    />
                  </div>
                  <p className="disclaimer">
                    N.B: A higher priority fee accelerates transaction
                    confirmations, paid to the Solana network for each trade.
                  </p>
                </div>
                <button onClick={toggleSlippage} className="save-settings">
                  {" "}
                  Save Settings
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TokenPage;
