import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Define the props type
interface SampledBarChartProps {
  dataMap: Map<number, number>; // Use a Map for data points
  weightMap?: Map<number, number>; // Optional weighted map
  label?: string;
  xLabel?: string;
  yLabel?: string;
}

class SampledBarChart extends Component<SampledBarChartProps> {
  render() {
    const { dataMap, weightMap, label, xLabel, yLabel } = this.props;

    // Calculate the total weight sum
    const totalWeightSum = weightMap
      ? Array.from(weightMap.values()).reduce((sum, weight) => sum + weight, 0)
      : 0;

    // Filter the dataMap based on the weightedMap
    const filteredDataMap = new Map<number, number>();
    dataMap.forEach((value, key) => {
      const weight = weightMap?.get(key) || 0;
      if (weight >= 0.01 * totalWeightSum) {
        filteredDataMap.set(key, value);
      }
    });

    // Sort the keys of the filteredDataMap
    const sortedKeys = Array.from(filteredDataMap.keys()).sort((a, b) => a - b);

    // Convert the sorted Map to arrays for labels and data
    const sampledLabels = sortedKeys;
    const sampledDataPoints = sortedKeys.map(
      (key) => filteredDataMap.get(key) as number
    );

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

    const options: any = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: "top" as const, // Explicitly type the position
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const value = context.raw;
              return `${value.toFixed(2)}`;
            },
          },
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
          beginAtZero: false, // Do not start the Y-axis at zero
          min: Math.min(...sampledDataPoints) * 0.95, // Set min to 95% of the smallest value
          max: Math.max(...sampledDataPoints) * 1.05, // Set max to 105% of the largest value
          title: {
            display: true,
            text: yLabel || "Y-Axis",
          },
        },
      },
    };

    return (
      <div>
        {label && <h2>{label}</h2>}
        <Bar data={data} options={options} />
      </div>
    );
  }
}

export default SampledBarChart;
