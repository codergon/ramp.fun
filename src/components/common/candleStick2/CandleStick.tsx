import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import {
  CandleStickController,
  FinancialElement,
} from "chartjs-chart-financial";

// Register necessary components and controllers
ChartJS.register(
  CategoryScale,
  LinearScale,
  CandleStickController,
  FinancialElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Sample candlestick data
const candlestickData = [
  { t: new Date("2022-01-01"), o: 100, h: 110, l: 90, c: 105 },
  { t: new Date("2022-01-02"), o: 105, h: 115, l: 95, c: 100 },
  { t: new Date("2022-01-03"), o: 100, h: 120, l: 90, c: 110 },
  { t: new Date("2022-01-04"), o: 110, h: 130, l: 100, c: 120 },
  { t: new Date("2022-01-05"), o: 120, h: 140, l: 110, c: 130 },
];

const data = {
  datasets: [
    {
      label: "Candlestick Data",
      data: candlestickData,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Candlestick Chart",
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "day",
        tooltipFormat: "ll",
      },
      title: {
        display: true,
        text: "Date",
      },
    },
    y: {
      title: {
        display: true,
        text: "Price",
      },
    },
  },
};

const CandlestickChart = () => {
  return <Chart type="candlestick" data={data} options={options} />;
};

export default CandlestickChart;
