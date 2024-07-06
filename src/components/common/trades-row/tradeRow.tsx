import "./tradeRow.scss";
import { Trade } from "../../../hooks/useTrades";
import {
  formatDate,
  formatTime,
  numberWithCommas,
  truncate,
} from "utils/HelperUtils";
import { formatEther } from "viem";
import { ShoppingCart, Tag } from "@phosphor-icons/react";

const TradeRow = ({
  trade,
  explorerUrl,
}: {
  trade: Trade;
  explorerUrl: String;
}) => {
  return (
    <tr className="trade-row-wrapper">
      <td className="border-radius1">
        <div className="type-wrapper">
          <div className="img-wrapper">
            {trade.action == "BUY" ? <ShoppingCart /> : <Tag />}{" "}
          </div>
          <div className="type">
            <p>{trade.action}</p>
            <p className="time">{formatTime(trade.timestamp)}</p>
          </div>
        </div>
      </td>
      <td>
        <div>
          <img src="./assets/images/user.png" alt="" />{" "}
          <a
            target="_blank"
            href={`${explorerUrl}/address/${trade.actor}`}
            className="schwarzy"
          >
            {truncate(trade.actor)}
          </a>
        </div>
      </td>
      <td>
        {trade.action == "BUY"
          ? parseFloat(formatEther(BigInt(trade.amountIn.toString()))).toFixed(
              6,
            )
          : parseFloat(formatEther(BigInt(trade.amountOut.toString()))).toFixed(
              6,
            )}
      </td>
      <td>
        {trade.action == "SELL"
          ? numberWithCommas(
              parseFloat(
                formatEther(BigInt(trade.amountIn.toString())),
              ).toFixed(2),
            )
          : numberWithCommas(
              parseFloat(
                formatEther(BigInt(trade.amountOut.toString())),
              ).toFixed(2),
            )}
      </td>
      <td>
        {parseFloat(formatEther(BigInt(trade.fee.toString()))).toFixed(8)}
      </td>
      <td className="border-radius2">{formatDate(trade.timestamp)}</td>
    </tr>
  );
};

export default TradeRow;
