import React from "react";
import { Line } from "react-chartjs-2";
import { useAppContext } from "../context/AppContext";
import moment from "moment";

const LineChart = () => {
  const { state } = useAppContext();
  const orders = state.orders;

  const sortedOrders = [...orders].sort(
    (a, b) => moment(a.orderDate) - moment(b.orderDate)
  );

  const dailyTotalAmounts = sortedOrders.reduce((accumulator, order) => {
    const day = moment(order.orderDate).format("MMM Do");
    accumulator[day] = (accumulator[day] || 0) + order.totalAmount;
    return accumulator;
  }, {});

  // Define the chart data
  const chartData = {
    labels: Object.keys(dailyTotalAmounts),
    datasets: [
      {
        label: "Total Revenue",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: Object.values(dailyTotalAmounts),
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
