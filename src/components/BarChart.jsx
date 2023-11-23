import React from "react";
import { Bar } from "react-chartjs-2";
import { useAppContext } from "../context/AppContext";

const BarChart = () => {
  const { state } = useAppContext();
  const products = state.products;

  // Extract product names and stock levels for the chart
  const productNames = products.map((product) => product.name);
  const stockLevels = products.map((product) => product.stock);

  const chartData = {
    labels: productNames,
    datasets: [
      {
        label: "Stock Levels",
        data: stockLevels,
        backgroundColor: "#3498db", // You can customize the color here
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Stock Levels",
        },
      },
      x: {
        title: {
          display: true,
          text: "Products",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend for simplicity
      },
    },
    responsive: true,
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default BarChart;
