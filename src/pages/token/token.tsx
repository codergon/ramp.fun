import TradeRow from "components/common/trades-row/tradeRow";
import "./token.scss";
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Close from "../../../public/assets/images/Vector.svg";
import { useToken } from "../../hooks/useToken";
import EmptyState from "components/common/empty-state";
import { truncate } from "utils/HelperUtils";
import { formatEther, parseEther } from "viem";
import { useWriteContract, useClient, useBlock } from "wagmi";
import { curveConfig, tokenConfig } from "../../constants/data";
import { getBalance, multicall, readContract } from "viem/actions";

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

interface TokenPool {
  token: `0x${string}`;
  // tokenReserve: bigint;
  // virtualTokenReserve: bigint;
  // ethReserve: bigint;
  // virtualEthReserve: bigint;
  lastPrice: bigint;
  // lastMcapInEth: bigint;
  // lastTimestamp: bigint;
  // lastBlock: bigint;
  // creator: `0x${string}`;
  migrated: boolean;
}

const TokenPage = () => {
  const { tokenId } = useParams();
  const [buyActive, setBuyActive] = useState(true);
  const [sellActive, setSellActive] = useState(false);
  const [tokenPool, setTokenPool] = useState<TokenPool>();
  const [tradeFeeParams, setTradeFeeParams] = useState<{rate: string; denom: string}>();
  const [ethAmount, setEthAmount] = useState("0");
  const [tokenAmount, setTokenAmount] = useState("0");
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [slippage, setSlippage] = useState("2");
  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const { token, loading, error} = useToken(tokenId ? tokenId : "");
  const client = useClient();
  const block = useBlock();

  const fetchPool = async (addr: `0x${string}`) => {
    const result = await readContract(client, {
      ...curveConfig,
      functionName: 'tokenPool',
      args: [addr]
    });
    const pool: TokenPool = {
      token: result[0],
      lastPrice: result[5],
      migrated: result[10]
    }
    setTokenPool(pool);
  }

  const fetchFeeParams = async () => {
    const fee = await readContract(client, {
      ...curveConfig,
      functionName: 'tradingFeeRate'
    });
    const denom = await readContract(client, {
      ...curveConfig,
      functionName: 'FEE_DENOMINATOR'
    });
    setTradeFeeParams({rate: fee.toString(), denom: denom.toString()});
  }

  const fetchBalances = async () => {
    if (client.account && token) {
      const ethBalance = await getBalance(client, {
        address: client.account?.address
      });
      const tokenBalance = await readContract(client, {
        ...tokenConfig,
        address: token.address as `0x${string}`,
        functionName: 'balanceOf',
        args: [client.account.address]
      });

      setEthBalance(formatEther(ethBalance));
      setTokenBalance(formatEther(tokenBalance));
    }
  }

  useEffect(() => {
    if (token) {
      fetchPool(token.address as `0x${string}`);
      fetchBalances();
      fetchFeeParams();
    }
  }, [token])

  const { writeContract } = useWriteContract();

  
  const handleBuy = async () => {
    if (!token) {
      return
    }
    if (ethAmount != "0" && tokenAmount != "0" && block.data) {
      const amountOutMin = parseEther(tokenAmount) - (parseEther(tokenAmount) * BigInt(slippage) / BigInt("100"));
      await writeContract({
        ...curveConfig,
        functionName: 'swapEthForTokens',
        args: [token.address as `0x${string}`, parseEther(ethAmount), amountOutMin, block.data.timestamp + BigInt(1*60)],
        // @ts-ignore
        value: parseEther(ethAmount)
      })
    }
  }

  const handleSell = async () => {
    if (!token) {
      return
    }
    if (ethAmount != "0" && tokenAmount != "0" && block.data) {
      const amountOutMin = parseEther(ethAmount) - (parseEther(ethAmount) * BigInt(slippage) / BigInt("100"));
      // Approve curve to send tokens
      await writeContract({
        ...tokenConfig,
        functionName: 'approve',
        address: token.address as `0x${string}`,
        args: [curveConfig.address, parseEther(tokenAmount)]
      })
      // sell tokens
      await writeContract({
        ...curveConfig,
        functionName: 'swapTokensForEth',
        args: [token.address as `0x${string}`, parseEther(tokenAmount), amountOutMin, block.data.timestamp + BigInt(1*60)]
      })
    }
  }

  const handleChangeTokenAmountIn = async (amountIn: string) => {
    if (!token || amountIn == "0") {
      return
    };
    const amountOut = await readContract(client, {
      ...curveConfig,
      functionName: 'calcAmountOutFromToken',
      args: [token.address as `0x${string}`, parseEther(amountIn)]
    });
    setTokenAmount(amountIn);
    setEthAmount(formatEther(amountOut));
  }

  const handleChangeEthAmountIn = async (amountIn: string) => {
    if (!token || amountIn == "0") {
      return
    };
    const amountOut = await readContract(client, {
      ...curveConfig,
      functionName: 'calcAmountOutFromEth',
      args: [token.address as `0x${string}`, parseEther(amountIn)]
    });
    setEthAmount(amountIn);
    setTokenAmount(formatEther(amountOut));
  }

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
      {
        token && tokenPool ?
        <div className="token-page-wrapper">
        <section className="section1">
          <div className="section1-left">
            <img
              className="tokenImg"
              src="./assets/images/tokenImg1.png"
              alt=""
            />
            <div className="text-wrapper">
              <h2>{token.name} (ticker: {token.symbol})</h2>
              <p>
                {token.description}. Pepebox has a market size of {formatEther(BigInt(token.marketCap))} ETH
              </p>
              <div className="creator-details">
                <div className="creator-name">
                  <img src="./assets/images/user.png" alt="" />
                  <p>
                    Created by <span className="schwarzy">{truncate(token.creator)}</span>
                  </p>
                </div>
                <div className="creator-address">
                  <img src="./assets/images/copy.png" alt="" />
                  <p>{truncate(token.creator)}</p>
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
              {
                buyActive ?
                <div>
                <div className="from-token">
                  <div>
                    <button className="from-token-btn">
                      <img src="./assets/images/eth.png" height="20" alt="" />
                      <p>ETH</p>
                      {/* <img src="./assets/images/arrowDown.png" alt="" /> */}
                    </button>
                  </div>
                  <div className="amount-wrapper">
                    <input
                      type="number"
                      placeholder="0.0"
                      name="quantity"
                      id="qunatity"
                      onChange={(e) => handleChangeEthAmountIn(e.target.value)}
                    />{" "}
                    <p className="wallet-bal-wrapper">
                      <img src="./assets/images/wallet.png " alt="" />
                      <span>{ethBalance}</span>
                    </p>{" "}
                  </div>
                </div>
                </div> :
                <div className="to-token">
                  <div>
                    <button className="from-token-btn">
                      <img src="./assets/images/3 2.png" alt="" />
                      <p>{token.symbol}</p>
                    </button>
                  </div>
                  <div className="amount-wrapper">
                    <input
                      type="number"
                      placeholder="0.0"
                      name="quantity"
                      id="qunatity"
                      onChange={(e) => handleChangeTokenAmountIn(e.target.value)}
                    />{" "}
                    <p className="wallet-bal-wrapper">
                      <img src="./assets/images/wallet.png " alt="" />
                      <span>{tokenBalance}</span>
                    </p>{" "}
                  </div>
                </div>
              }
              
              {/* <button className="switch-token">
                <img src="./assets/images/swap.png" alt="" />
              </button> */}
            </div>
            <button className="trade-btn" onClick={buyActive ? handleBuy : handleSell }>Place trade</button>
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
                <p>Set max spillage</p>
              </div>
              <div className="inputs">
                <div className="max-spillage-wrapper">
                  <p>Max Spillage</p>
                  <div className="max-spillage">
                    <input
                      type="number"
                      name="spillage"
                      id="spillage"
                      placeholder="2%"
                      onChange={(e) => setSlippage(e.target.value)}
                    />
                  </div>
                </div>
                {/* <div className="priority-fee-wrapper">
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
                </div> */}
                <button onClick={toggleSlippage} className="save-settings">
                  {" "}
                  Save Settings
                </button>
              </div>
            </div>
          </section>
        )}
        </div> :
        <EmptyState data={{message: loading ? "Loading" : "Not found"}} />
      }
    </div>
  );
};

export default TokenPage;
