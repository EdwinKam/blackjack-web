// src/components/SampledBarChart.tsx
import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register the necessary components
ChartJS.register(BarElement, CategoryScale, LinearScale);

// Define the props type
interface SampledBarChartProps {
  dataMap: Map<number, number>; // Use a Map for data points
  label?: string;
  xLabel?: string;
  yLabel?: string;
}

class SampledBarChart extends Component<SampledBarChartProps> {
  render() {
    const { dataMap, label, xLabel, yLabel } = this.props;

    // Convert the Map to arrays for labels and data
    const sampledLabels = Array.from(dataMap.keys());
    const sampledDataPoints = Array.from(dataMap.values());

    const data = {
      labels: sampledLabels, // X-axis labels
      datasets: [
        {
          label: label || "Dataset",
          data: sampledDataPoints,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: xLabel || "X-Axis",
          },
        },
        y: {
          title: {
            display: true,
            text: yLabel || "Y-Axis",
          },
        },
      },
    };

    return (
      <div>
        <h2>{label || "Sampled Bar Chart"}</h2>
        <Bar data={data} options={options} />
      </div>
    );
  }
}

export default SampledBarChart;
