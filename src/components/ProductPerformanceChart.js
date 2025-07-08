import React from "react";
import Chart from "react-apexcharts";

const ProductPerformanceChart = () => {
  const series = [67, 25, 8]; // القيم النسبية لكل فئة

  const options = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: ["ممتاز", "يحتاج تحسين", "ضعيف"],
    colors: ["#4BB8A9", "#facc15", "#f87171"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
    legend: {
      position: "right",
      horizontalAlign: "center",
      fontSize: "14px",
      markers: {
        radius: 12,
      },
      labels: {
        colors: "#fff",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val.toFixed(0)}%`,
      },
    },
    stroke: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">📊 توزيع أداء منتجاتك</h2>
      <div className="max-w-md mx-auto">
        <Chart options={options} series={series} type="donut" width="100%" height={300} />
      </div>
    </div>
  );
};

export default ProductPerformanceChart;