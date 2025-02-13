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
        {label && <h2>{label}</h2>}
        <Bar data={data} options={options} />
      </div>
    );
  }
}

export default SampledBarChart;
