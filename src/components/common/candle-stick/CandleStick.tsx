import React from "react";
import "./CandleStick.scss";
import { Chart, registerables } from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";

Chart.register(...registerables);

const CandleStick = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: "Candlestick Chart",
        data: data,
        borderColor: "rgba(0, 0, 0, 1)",
        borderWidth: 1,
        backgroundColor: (context) => {
          const { open, close } = context.raw;
          return open > close ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 255, 0, 0.5)";
        },
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        beginAtZero: false,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const { open, high, low, close } = context.raw;
            return `O: ${open}, H: ${high}, L: ${low}, C: ${close}`;
          },
        },
      },
    },
  };
  return <ReactChart type="candlestick" data={chartData} options={options} />;
};

export default CandleStick;
