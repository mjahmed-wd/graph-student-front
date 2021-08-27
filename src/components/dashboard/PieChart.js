import React from 'react';
import { Pie } from 'react-chartjs-2';



const PieChart = ({subjectCount}) =>{
    // const modifiedData= Object.entries(subjectCount).forEach(([keys, values]) =>
    // console.log({ subject: keys, count: keys }))
    console.log(subjectCount, "cojnt")
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              `#${Math.floor(Math.random()*16777215).toString(16)}`
            ],
            borderWidth: 1,
          },
        ],
      };
    return (
  <>
    <div className='header'>
      <h1 className='title'>Pie Chart</h1>
      <div className='links'>
        <a
          className='btn btn-gh'
          href='https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Pie.js'
        >
          Github Source
        </a>
      </div>
    </div>
    <Pie data={data} />
  </>
)};

export default PieChart;