import React from "react";
import { Pie } from "react-chartjs-2";

const PieChart = ({ subjectCount }) => {
  const data = {
    labels: subjectCount.subName,
    datasets: [
      {
        label: "# of Votes",
        data: subjectCount.subCount,
        backgroundColor: subjectCount.subName.map(
          (item) => `#${Math.floor(Math.random() * 16777215).toString(16)}`
        ),
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="w-25">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default PieChart;
