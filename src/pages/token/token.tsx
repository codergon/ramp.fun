import "./token.scss";
import { toast } from "sonner";
import { useTrades } from "hooks/useTrades";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToken } from "../../hooks/useToken";
import EmptyState from "components/common/empty-state";
import { Address, formatEther, parseEther } from "viem";
import TradeRow from "components/common/trades-row/tradeRow";
import { numberWithCommas, truncate } from "utils/HelperUtils";
import { curveConfig, tokenConfig } from "../../constants/data";
import { useWriteContract, useClient, useBlock, useAccount } from "wagmi";
import {
  getBalance,
  readContract,
  waitForTransactionReceipt,
} from "viem/actions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, ArrowRight, Wallet } from "@phosphor-icons/react";
import { usePoolAndMigrationThreshold } from "hooks/usePoolAndMigrationThreshold";
import { useConfig } from "wagmi";

const TokenPage = () => {
  const { tokenId } = useParams();
  const [buyActive, setBuyActive] = useState(true);
  const [sellActive, setSellActive] = useState(false);
  const [ethAmountIn, setEthAmountIn] = useState("0");
  const [ethAmountOut, setEthAmountOut] = useState("0");
  const [tokenAmountIn, setTokenAmountIn] = useState("0");
  const [tokenAmountOut, setTokenAmountOut] = useState("0");
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [slippage, setSlippage] = useState("2");
  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const {
    isLoading: isTokenLoading,
    data: token,
    refetch: refetchToken,
    error: tokenError,
  } = useToken(tokenId ? tokenId : "");
  const { data: trades, refetch: refreshTrades } = useTrades(
    tokenId ? tokenId : "",
    "timestamp",
    10,
  );
  const client = useClient();
  const config = useConfig();
  const { refetch: refetchBlock } = useBlock();
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [disableBtn, setDisableBtn] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const {
    data: pool,
    isLoading: isPoolLoading,
    error: poolError,
  } = usePoolAndMigrationThreshold(token?.address as `0x${string}`, config);

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
    toast.error("An error occured while placing your trade.");
    setDisableBtn(false);
    setBtnLoading(false);
  };

  const handleSuccess = async (hash: Address) => {
    try {
      // @ts-ignore
      await waitForTransactionReceipt(client, {
        hash,
      });
      await refetchToken();
      await refreshTrades();
      toast.success(
        <div>
          <p>Trade placed successfully</p>
          <a href={`${client.chain.blockExplorers.default.url}/tx/${hash}`} target="_blank">{truncate(`${hash}`)}</a>
        </div>
      )
    } catch (e) {
      // @ts-ignore
      handleError(e.message);
    } finally {
      setDisableBtn(false);
      setBtnLoading(false);
    }
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
      },
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
        },
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
        },
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
  const handleCopyTokenAddress = async () => {
    setCopied(false);
    if (token?.address) {
      try {
        await navigator.clipboard.writeText(token.address);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      } catch (err) {
        toast.error("Unable to copy content to clipboard");
        console.error("Failed to copy content: ", err);
        setCopied(false);
      }
    } else {
      toast.error("No token address found");
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const hour = date.getHours().toString().padStart(2, "0");
    return `${day} ${month} ${hour}:00`;
  };

  const data = token?.prices.items.map((item) => ({
    time: formatDate(item.id),
    price: item.close,
  }));

  const formatYAxis = (value: string) => {
    const ethValue = parseFloat(formatEther(BigInt(value)));
    if (ethValue === 0) return "0 ETH";

    if (ethValue < 1e-6) {
      const scientificStr = ethValue.toExponential(6);
      const [mantissa, exponent] = scientificStr.split("e");
      const absExponent = Math.abs(parseInt(exponent));
      return `0.${"0".repeat(absExponent - 1)}${mantissa.replace(".", "")} ETH`;
    }

    if (ethValue >= 1) return `${ethValue.toFixed(2)} ETH`;
    if (ethValue >= 0.01) return `${ethValue.toFixed(4)} ETH`;
    return `${ethValue.toFixed(6)} ETH`;
  };

  return (
    <div className="token-page">
      {pool && token ? (
        <div className="token-page-wrapper">
          <section className="section1">
            <div className="section1-left">
              <img
                className="tokenImg"
                src={
                  token?.logoUrl.slice(0, 5) == "https"
                    ? token?.logoUrl
                    : "./assets/images/tokenImg1.png"
                }
                height={"260px"}
                style={{ borderRadius: "15px" }}
                alt=""
              />
              <div className="text-wrapper">
                <h2>
                  {token?.name} (${token?.symbol})
                </h2>
                <p>
                  {token?.description}. <br />
                  {token?.name} has a market size of{" "}
                  {formatEther(BigInt(token?.marketCap))} ETH
                </p>
                <div className="creator-details">
                  <div className="creator-name">
                    <img src="./assets/images/user.png" alt="" />
                    <p>
                      Created by{" "}
                      <a
                        href={`${client.chain.blockExplorers.default.url}/address/${token?.creator}`}
                        target="_blank"
                        className="schwarzy"
                      >
                        {truncate(token?.creator)}
                      </a>
                    </p>
                  </div>
                  <div
                    onClick={handleCopyTokenAddress}
                    className="creator-address"
                  >
                    <img src="./assets/images/copy.png" alt="" />
                    <p>{truncate(token?.address)}</p>
                    {copied && <p className="address-copied">Address copied</p>}
                  </div>
                </div>
              </div>
            </div>
            {token?.isMigrated ? (
              <div className=" migrated-wrapper">
                <div className="migrated-text">
                  <h2>Token has been migrated</h2>

                  <a
                    href={`https://app.frax.finance/swap/main?from=${token?.address}&to=native`}
                    target="blank"
                  >
                    Trade on FraxSwap
                  </a>
                </div>
              </div>
            ) : (
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
                              <Wallet />
                              <span>{parseFloat(ethBalance).toFixed(4)}</span>
                            </p>
                          </div>
                          <p className="recieve-amount">
                            You recieve{" "}
                            <span>
                              {numberWithCommas(
                                parseFloat(tokenAmountOut).toFixed(2),
                              )}{" "}
                              {token?.symbol}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="to-token">
                      <div>
                        <button className="from-token-btn">
                          <img
                            src={token?.logoUrl}
                            style={{ borderRadius: "5px", width: "20px" }}
                          />
                          <p>{token?.symbol}</p>
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
                            <Wallet />
                            <span>
                              {numberWithCommas(
                                parseFloat(tokenBalance).toFixed(2),
                              )}
                              &nbsp;
                              {/* {token?.symbol} */}
                            </span>
                          </p>{" "}
                        </div>
                        <p className="recieve-amount">
                          You recieve <span>{ethAmountOut} ETH</span>
                        </p>
                      </div>
                    </div>
                  )}
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
                  <div className="bonding-curve-wrapper">
                    <p>Bonding Curve Progress: {pool?.bondingPercentage}%</p>
                    <div className="bonding-curve-loader">
                      <div
                        style={{
                          width: `${pool?.bondingPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="section2">
            <ResponsiveContainer width="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="time"
                  stroke="#9CA3AF"
                  minTickGap={2}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  textAnchor="end"
                  height={60}
                  interval="preserveStartEnd"
                  label={{
                    value: "random randome text",
                    position: "insideBottomRight",
                    offset: -20,
                  }}
                />
                <YAxis
                  stroke="#9CA3AF"
                  tick={{ fill: "#9CA3AF", fontSize: 9 }} // Reduced font size here
                  tickFormatter={(value) => formatYAxis(value.toString())}
                  width={120} // Increased width to accommodate longer numbers
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  itemStyle={{ color: "#E5E7EB" }}
                  formatter={(value) => [
                    formatYAxis(value.toString()),
                    "Price",
                  ]}
                  labelStyle={{ color: "#9CA3AF" }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8, fill: "#3B82F6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
          <section className="section3">
            <div className="section3-header">
              <h2>Trades</h2>{" "}
              <div>
                <button>
                  <ArrowLeft size={20} />
                </button>

                <p>1</p>

                <button>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
            <div className="trades-table-wrapper">
              <table>
                <tr className="table-header">
                  <th className="border-radius1">Type</th>
                  <th>Account</th>
                  <th>ETH</th>
                  <th>{token?.symbol}</th>
                  <th>Fee</th>
                  <th className="border-radius2">Date</th>
                </tr>
                {trades?.map((trade, index) => (
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
          isLoading={isPoolLoading || isTokenLoading}
          error={tokenError ? tokenError : poolError}
        />
      )}
    </div>
  );
};

export default TokenPage;
