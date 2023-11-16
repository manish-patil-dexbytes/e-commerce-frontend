// export default BarGraph;
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function BarGraph() {
 
  // Create a ref to hold the chart instance
  const chartRef = useRef(null);

  // Create a variable to hold the chart inst ance
  let myChart = null;

  useEffect(() => {
    // Data for the bar chart
    const data = {
      labels: [
        "Label 1",
        "Label 2",
        "Label 3",
        "Label 4",
        "Label 5",
        "level 6",
        "level 7",
        "Label 1",
        "Label 1",
        "Label 10",
      ],
    
      datasets: [
        {
          label: "Graph for Data",
          backgroundColor: "rgba(227, 151, 75, 1)",
          borderColor: "rgba(0, 0, 0, 1)",
          borderWidth: 1,
          data: [12, 19, 30, 5, 10, 5 ,20,23,19,12],
          
        },
      ],
    };

    // Get the canvas element using the ref
    const ctx = chartRef.current;

    // Create the chart if it doesn't exist
    if(myChart){
      myChart.destroy();
    }
    // Create the chart
    myChart = new Chart(ctx, {
      type: "bar",
      data: data,
    });
    return () => {
      if (myChart) {
        myChart.destroy();
      }
    };

   
  }, []);

  return (
    <div className="container col-md-10">
      <div>
        <div className="col-md-10 " style={{ marginTop: "-100px"  }}>
          <canvas id="barChart" ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default BarGraph;
