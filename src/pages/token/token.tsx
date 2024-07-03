import TradeRow from "components/common/trades-row/tradeRow";
import { ClipLoader } from "react-spinners";
import "./token.scss";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToken } from "../../hooks/useToken";
import EmptyState from "components/common/empty-state";
import { numberWithCommas, truncate } from "utils/HelperUtils";
import { Address, formatEther, parseEther } from "viem";
import { useWriteContract, useClient, useBlock, useAccount } from "wagmi";
import { curveConfig, tokenConfig } from "../../constants/data";
import {
  getBalance,
  readContract,
  waitForTransactionReceipt,
} from "viem/actions";
import SuccessToast from "../../components/modals/success-toast/successToast";
import FailedToasts from "../../components/modals/failed-toast/FailedToast";
import { useTrades } from "hooks/useTrades";

interface TokenPool {
  token: Address;
  lastPrice: bigint;
  migrated: boolean;
}

const TokenPage = () => {
  const { tokenId } = useParams();
  const [buyActive, setBuyActive] = useState(true);
  const [sellActive, setSellActive] = useState(false);
  const [tokenPool, setTokenPool] = useState<TokenPool>();
  const [ethAmountIn, setEthAmountIn] = useState("0");
  const [ethAmountOut, setEthAmountOut] = useState("0");
  const [tokenAmountIn, setTokenAmountIn] = useState("0");
  const [tokenAmountOut, setTokenAmountOut] = useState("0");
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [slippage, setSlippage] = useState("2");
  const [showFailModal, setShowFailModal] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txnHash, setTxnHash] = useState("");
  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const {
    token,
    loading: tokenLoading,
    refetch: refetchToken,
  } = useToken(tokenId ? tokenId : "");
  const { trades, refresh: refreshTrades } = useTrades(
    tokenId ? tokenId : "",
    "timestamp",
    10
  );
  const [disableBtn, setDisableBtn] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  const client = useClient();
  const { address, isConnected } = useAccount();
  const { refetch: refetchBlock } = useBlock();
  const { writeContractAsync } = useWriteContract();

  const fetchPool = async (addr: Address) => {
    // @ts-ignore
    const result = await readContract(client, {
      ...curveConfig,
      functionName: "tokenPool",
      args: [addr],
    });
    const pool: TokenPool = {
      token: result[0],
      lastPrice: result[5],
      migrated: result[10],
    };
    setTokenPool(pool);
  };

  const fetchBalances = async () => {
    if (address && token) {
      // @ts-ignore
      const ethBalance = await getBalance(client, {
        address: address,
      });
      // @ts-ignore
      const tokenBalance = await readContract(client, {
        ...tokenConfig,
        address: token.address,
        functionName: "balanceOf",
        args: [address],
      });
      setEthBalance(formatEther(ethBalance));
      setTokenBalance(formatEther(tokenBalance));
    }
  };

  const [bondingPercentage, setBondingPercentage] = useState(20);

  useEffect(() => {
    if (token) {
      fetchPool(token.address);
    }
  }, [token]);

  useEffect(() => {
    if (address) {
      fetchBalances();
      setDisableBtn(false);
    } else {
      setEthBalance("0");
      setTokenBalance("0");
    }
  }, [isConnected, token]);

  const handleError = (error: any) => {
    console.log(error);
    setShowFailModal(true);
    setDisableBtn(false);
    setBtnLoading(false);
    setTimeout(() => {
      setShowFailModal(false);
    }, 3000);
  };

  const handleSuccess = async (hash: Address) => {
    try {
      // @ts-ignore
      await waitForTransactionReceipt(client, {
        hash,
      });
      await refetchToken();
      setTxnHash(hash);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
    } catch (e) {
      handleError(e);
    }
    setDisableBtn(false);
    setBtnLoading(false);
  };

  const handleApprovalSuccess = async (hash: Address) => {
    // @ts-ignore
    await waitForTransactionReceipt(client, {
      hash,
    });
    const amountOutMin =
      parseEther(ethAmountOut) -
      (parseEther(ethAmountOut) * BigInt(slippage)) / BigInt("100");
    const { data } = await refetchBlock();
    // sell tokens
    await writeContractAsync(
      {
        ...curveConfig,
        functionName: "swapTokensForEth",
        args: [
          token!.address,
          parseEther(tokenAmountIn),
          amountOutMin,
          data!.timestamp + BigInt(1 * 60),
        ],
      },
      {
        onSuccess: async (hash) => {
          await handleSuccess(hash);
        },
        onError: (e) => {
          handleError(e.message);
        },
      }
    );
  };

  const handleBuy = async () => {
    setDisableBtn(true);
    setBtnLoading(true);
    if (!token) {
      return;
    }
    if (ethAmountIn != "0" && tokenAmountOut != "0") {
      const { data, error } = await refetchBlock();
      if (!data) {
        handleError(error);
        setDisableBtn(true);
        return;
      }
      const amountOutMin =
        parseEther(tokenAmountOut) -
        (parseEther(tokenAmountOut) * BigInt(slippage)) / BigInt("100");
      await writeContractAsync(
        {
          ...curveConfig,
          functionName: "swapEthForTokens",
          args: [
            token.address,
            parseEther(ethAmountIn),
            amountOutMin,
            data.timestamp + BigInt(1 * 60),
          ],
          // @ts-ignore
          value: parseEther(ethAmountIn),
        },
        {
          onSuccess: async (data) => {
            await handleSuccess(data);
          },
          onError: (error) => {
            handleError(error.message);
          },
        }
      );
    }
  };

  const handleSell = async () => {
    setDisableBtn(true);
    setBtnLoading(true);
    if (!token) {
      return;
    }
    if (ethAmountOut != "0" && tokenAmountIn != "0") {
      const { data, error } = await refetchBlock();
      if (!data) {
        handleError(error);
        setDisableBtn(true);
        return;
      }
      // Approve curve to send tokens
      await writeContractAsync(
        {
          ...tokenConfig,
          functionName: "approve",
          address: token.address,
          args: [curveConfig.address, parseEther(tokenAmountIn)],
        },
        {
          onSuccess: async (hash) => {
            await handleApprovalSuccess(hash);
          },
          onError: (error) => {
            handleError(error.message);
          },
        }
      );
    }
  };

  const handleChangeTokenAmountIn = async (amountIn: string) => {
    if (!token || amountIn == "0") {
      return;
    }
    if (!amountIn) {
      setTokenAmountIn("0");
      return;
    }
    if (parseInt(amountIn) < 0) {
      setTokenAmountIn("0");
      return;
    }
    setTokenAmountIn(amountIn);
    // @ts-ignore
    const amountOut = await readContract(client, {
      ...curveConfig,
      functionName: "calcAmountOutFromToken",
      args: [token.address, parseEther(amountIn)],
    });
    setEthAmountOut(formatEther(amountOut));
  };

  const handleChangeEthAmountIn = async (amountIn: string) => {
    if (!token || amountIn == "0") {
      return;
    }
    if (!amountIn) {
      setEthAmountIn("0");
      return;
    }
    if (parseInt(amountIn) < 0) {
      setEthAmountIn("0");
      return;
    }
    // @ts-ignore
    const amountOut = await readContract(client, {
      ...curveConfig,
      functionName: "calcAmountOutFromEth",
      args: [token.address, parseEther(amountIn)],
    });
    setEthAmountIn(amountIn);
    setTokenAmountOut(formatEther(amountOut));
  };

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

  //function to copy token creator to clipboard
  const [copied, setCopied] = useState(false);
  const handleCopyTokenCreator = async () => {
    setCopied(false);
    if (token?.creator) {
      try {
        await navigator.clipboard.writeText(token.creator);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      } catch (err) {
        console.error("Failed to copy content: ", err);
        setCopied(false);
      }
    } else {
      alert("No token creator found");
    }
  };

  return (
    <div className="token-page">
      {token && tokenPool ? (
        <div className="token-page-wrapper">
          <section className="section1">
            <div className="section1-left">
              <img
                className="tokenImg"
                src="./assets/images/tokenImg1.png"
                alt=""
              />
              <div className="text-wrapper">
                <h2>
                  {token.name} (ticker: {token.symbol})
                </h2>
                <p>
                  {token.description}. {token.name} has a market size of{" "}
                  {formatEther(BigInt(token.marketCap))} ETH
                </p>
                <div className="creator-details">
                  <div className="creator-name">
                    <img src="./assets/images/user.png" alt="" />
                    <p>
                      Created by{" "}
                      <a
                        href={`${client.chain.blockExplorers.default.url}/address/${token.creator}`}
                        target="_blank"
                        className="schwarzy"
                      >
                        {truncate(token.creator)}
                      </a>
                    </p>
                  </div>
                  <div
                    onClick={handleCopyTokenCreator}
                    className="creator-address"
                  >
                    <img src="./assets/images/copy.png" alt="" />
                    <p>{truncate(token.creator)}</p>
                    {copied && <p className="address-copied">Address copied</p>}
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
                {buyActive ? (
                  <div>
                    <div className="from-token">
                      <div>
                        <button className="from-token-btn">
                          <img
                            src="./assets/images/eth.png"
                            height="20"
                            alt=""
                          />
                          <p>ETH</p>
                          {/* <img src="./assets/images/arrowDown.png" alt="" /> */}
                        </button>
                      </div>
                      <div className="amount-container">
                        <div className="amount-wrapper">
                          <input
                            type="number"
                            min="0"
                            placeholder="0.0"
                            name="quantity"
                            id="qunatity"
                            onChange={(e) =>
                              handleChangeEthAmountIn(e.target.value)
                            }
                          />{" "}
                          <p className="wallet-bal-wrapper">
                            <img src="./assets/images/wallet.png " alt="" />
                            <span>{parseFloat(ethBalance).toFixed(4)}</span>
                          </p>
                        </div>
                        <p className="recieve-amount">
                          You recieve{" "}
                          <span>
                            {numberWithCommas(
                              parseFloat(tokenAmountOut).toFixed(2)
                            )}{" "}
                            {token.symbol}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="to-token">
                    <div>
                      <button className="from-token-btn">
                        <img src="./assets/images/3 2.png" alt="" />
                        <p>{token.symbol}</p>
                      </button>
                    </div>
                    <div className="amount-container">
                      <div className="amount-wrapper">
                        <input
                          type="number"
                          placeholder="0.0"
                          name="quantity"
                          id="qunatity"
                          onChange={(e) =>
                            handleChangeTokenAmountIn(e.target.value)
                          }
                        />{" "}
                        <p className="wallet-bal-wrapper">
                          <img src="./assets/images/wallet.png " alt="" />
                          <span>
                            {numberWithCommas(
                              parseFloat(tokenBalance).toFixed(2)
                            )}
                          </span>
                        </p>{" "}
                      </div>
                      <p className="recieve-amount">
                        You recieve <span>{ethAmountOut} ETH </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* <button className="switch-token">
                  <img src="./assets/images/swap.png" alt="" />
                </button> */}
              </div>
              <div className="btn-wrapper">
                <button
                  className={
                    disableBtn ||
                    (buyActive && (ethAmountIn == "0" || !ethAmountIn)) ||
                    (!buyActive && (tokenAmountIn == "0" || !tokenAmountIn))
                      ? "disabled-btn"
                      : "trade-btn"
                  }
                  disabled={
                    disableBtn ||
                    (buyActive && (ethAmountIn == "0" || !ethAmountIn)) ||
                    (!buyActive && (tokenAmountIn == "0" || !tokenAmountIn))
                      ? true
                      : false
                  }
                  onClick={buyActive ? handleBuy : handleSell}
                >
                  {btnLoading ? (
                    <ClipLoader
                      size={20}
                      color={"#fff"}
                      loading={btnLoading}
                      aria-label="Loading Spinner"
                    />
                  ) : (
                    <p>Place trade</p>
                  )}
                </button>

                {showSuccessModal && (
                  <div className="marginTop">
                    <SuccessToast
                      {...{
                        message: "Trade sucessfully placed",
                        hash: txnHash,
                        url: `${client.chain.blockExplorers.default.url}/tx/${txnHash}`,
                      }}
                    />
                  </div>
                )}
                {showFailModal && (
                  <div className="marginTop">
                    <FailedToasts />
                  </div>
                )}
                <div className="bonding-curve-wrapper">
                  <p>Bonding Curve: {bondingPercentage}%</p>
                  <div className="bonding-curve-loader">
                    <div
                      style={{
                        width: `${bondingPercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <section className="section2"></section> */}
          <section className="section3">
            <div className="section3-header">
              <h2>Trades</h2>{" "}
              <div>
                <img
                  className="prev-btn"
                  src="./assets/images/next.png"
                  alt=""
                />{" "}
                <p>1</p>{" "}
                <img
                  className="next-btn"
                  src="./assets/images/next.png"
                  alt=""
                />{" "}
              </div>
            </div>
            <div className="trades-table-wrapper">
              <table>
                <tr className="table-header">
                  <th className="border-radius1">Type</th>
                  <th>Account</th>
                  <th>ETH</th>
                  <th>{token.symbol}</th>
                  <th>Fee</th>
                  <th className="border-radius2">Date</th>
                </tr>
                {trades.map((trade, index) => (
                  <TradeRow
                    key={index}
                    trade={trade}
                    explorerUrl={client.chain.blockExplorers.default.url}
                  />
                ))}
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
        </div>
      ) : (
        <EmptyState
          data={{ message: tokenLoading ? "Loading" : "Not found" }}
        />
      )}
    </div>
  );
};

export default TokenPage;
