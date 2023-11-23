import React from "react";
import { Pie } from "react-chartjs-2";
import { useAppContext } from "../context/AppContext";

const PieChart = () => {
  const { state } = useAppContext();
  const products = state.products;

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = 1;
    } else {
      acc[category]++;
    }
    return acc;
  }, {});

  const categoryNames = Object.keys(productsByCategory);
  const categoryCounts = Object.values(productsByCategory);

  const chartData = {
    labels: categoryNames,
    datasets: [
      {
        data: categoryCounts,
        backgroundColor: [
          "#3498db",
          "#2ecc71",
          "#e74c3c",
          "#f39c12",
          "#9b59b6",
          "#34495e",
        ],
        borderColor: "rgba(255, 255, 255, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "right",
      },
    },
    responsive: true,
  };

  return <Pie data={chartData} options={chartOptions} />;
};

export default PieChart;
