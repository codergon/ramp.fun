import React from "react";
import "./tradeRow.scss";

const TradeRow = ({ trade }) => {
  return (
    <tr className="trade-row-wrapper">
      <td className="border-radius1">
        <div className="type-wrapper">
          <div className="img-wrapper">
            <img
              src={
                trade.type == "Bought"
                  ? "./assets/images/cart.png"
                  : "./assets/images/tags.png"
              }
              alt=""
            />{" "}
          </div>
          <div className="type">
            <p>{trade.type}</p>
            <p className="time">{trade.time}</p>
          </div>
        </div>
      </td>
      <td>
        <div>
          <img src="./assets/images/user.png" alt="" />{" "}
          <p className="schwarzy">{trade.account}</p>
        </div>
      </td>
      <td>{trade.sol}</td>
      <td>{trade.pepebox}</td>
      <td>{trade.date}</td>
      <td className="border-radius2 schwarzy ">{trade.transactions}</td>
    </tr>
  );
};

export default TradeRow;
