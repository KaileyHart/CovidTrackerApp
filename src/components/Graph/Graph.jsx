import React, { useState, useEffect } from "react";
import {Chart, registerables} from 'chart.js';
import { Line } from "react-chartjs-2";
import numeral from "numeral";

Chart.register(...registerables);



function Graph({ casesType }) {

  const [data, setData] = useState({});

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      }
    },
      elements: {
        point: {
          radius: 0,
        },
      },
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (tooltipItem, data) {
            return numeral(tooltipItem.value).format("+0,0");
          },
        },
      },
      scales: {
        x: {
          time: {
              format: "MM/DD/YY",
              tooltipFormat: "ll",
            },
        },
        y: {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        }
      }
  };

  const buildChartData = (data, casesType = "cases") => {

    let chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {

      if (lastDataPoint) {

        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };

        chartData.push(newDataPoint);

      }

      lastDataPoint = data[casesType][date];

    }

    return chartData;

  };

  useEffect(() => {

    const fetchData = async () => {

      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          // console.log(chartData);

        });
    };

    fetchData();

  }, [casesType]);


  // ! This must have a div container. Changing it to React.Fragment causes the whole box to expand. -- 01/22/2024 KH */}
  return (
    <div>

    {data.length > 0 ?

      <Line
      options={options}
      data={{datasets: [{backgroundColor: "rgba(204,16,52,0.5)", borderColor: "#cc1034", data: data}] }}
      />

    : null}

    </div>
  );
}

export default Graph;
