import React from 'react';
import BarChartComponent from '../charts/BarChartComponent';
import TableComponent from '../charts/TableComponent';
import ChartScatterComponent from '../charts/ChartScatterComponent';
import DensityChartComponent from '../charts/DensityChartComponent';
import BoxandWhiskerComponent from '../charts/BoxandWhiskerComponent';
import './ChartContainer.css';

class ChartContainer extends React.Component {
  render() {


    const { 
      data, 
      title, 
      height, 
      width, 
      type, 
      xAxisTitle, 
      yAxisTitle, 
      label,
      titleRender,
    } = this.props;

    // console.log(data.trumpData);
    // console.log(data.bidenData);
    console.log({
      groups: [data.bidenData[0],data.bidenData[1] 
      ],
    })
    return (

      <>


      {/* State Summary */}
      {titleRender && (
        <>
        <div className="chartBox">
        <h4 className="title">{title}</h4>
        {type === 'bar' && (
          <BarChartComponent 
            categoryData={data} 
            height={height} 
            width={width} 
            label={label}
            xAxisTitle={xAxisTitle}
            yAxisTitle={yAxisTitle}
          />
        )}

        </div>
        </>)}


        {type === 'table' && (
          <TableComponent 
            categoryData={data} 
            height={height} 
            width={width} 
          />
        )}

       

        {type === 'density' && (
          <DensityChartComponent 
            // title={title} 
            data={{
              groups: [data.bidenData[0],data.bidenData[1] 
              ],
            }} 
            height={height} 
            width={width} 
            // xLabel={xAxisTitle} 
            // yLabel={yAxisTitle} 
          />
        )}

        {type === 'boxandwhisker' && (
          <BoxandWhiskerComponent 
            data={data} 
            xAxisTitle={xAxisTitle} 
            yAxisTitle={yAxisTitle} 
            height={height} 
            width={width} 
          />
        )}

      {type === 'scatter' && (
          <ChartScatterComponent 
            data={data} 
            height={height} 
            width={width} 
            dataSets={null} 
            populationStat={null} 
          />
        )}
      </>

    );
  }
}

export default ChartContainer;
