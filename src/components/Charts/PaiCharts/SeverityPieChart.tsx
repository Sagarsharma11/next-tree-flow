import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

// ✅ Register elements + plugin
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SeverityPieChart = ({ data }) => {
  // Count severity levels
  const counts = data.reduce((acc, item) => {
    acc[item.severity] = (acc[item.severity] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#e74c3c", // high
          "#f1c40f", // medium
          "#2ecc71", // low
          "#8B0000", // critical
          "#53EAFD", // info
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true, // make legend symbols custom
          pointStyle: "rect", // ✅ square legends
          padding: 20,
        },
      },
      datalabels: {
        color: "#fff",
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1) + "%";
          return `${value} (${percentage})`; // shows count + %
        },
      },
    },
  };

  return (
    <div className="border flex justify-center p-4" style={{ height: "400px" }}>
      <Pie data={chartData} 
      //@ts-ignore
      options={options} 
      
      />
    </div>
  );
};

export default SeverityPieChart;
