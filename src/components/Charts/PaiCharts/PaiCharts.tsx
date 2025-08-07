// SecurityPieChart.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PaiCharts = ({ issues }) => {
  console.log("pie chart issue ", issues)
  //@ts-ignore
  const chartRef = useRef();

  useEffect(() => {
    if (!issues || issues.length === 0) return;
    //@ts-ignore
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const severityCounts = d3.rollups(
      issues,
      v => v.length,
      //@ts-ignore
      d => d.severity
    );

    const color = d3.scaleOrdinal()
      .domain(['High', 'Medium', 'Low'])
      .range([
        '#e67e22', // High - Orange
        '#e74c3c', // Critical - Vibrant Red
        '#53EAFD',  // Info - Blue
        '#2ecc71', // Low - Green
        '#f1c40f', // Medium - Yellow
      ])


    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);

    const g = svg
      .attr('width', width) 
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcs = g.selectAll('arc')
      //@ts-ignore
      .data(pie(severityCounts))
      .enter()
      .append('g');


    arcs.append('path')
      //@ts-ignore
      .attr('d', arc)
      //@ts-ignore
      .attr('fill', d => color(d.data[0]))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', function () {
            //@ts-ignore
            const [x, y] = arc.centroid(d);
            return `translate(${x * 0.1}, ${y * 0.1})`; // Push outward
          })
          .attr('stroke-width', 1);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'translate(0,0)')
          .attr('stroke-width', 2);
      });


    arcs.append('text')
      //@ts-ignore
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'black')
      .text(d => `${d.data[0]} (${d.data[1]})`);
  }, [issues]);

  return (
    <div className='border flex flex-col justify-center items-center p-4 '>

      <svg
        //@ts-ignore
        ref={chartRef}></svg>
      <h2>Security Issues by Severity</h2>
    </div>
  );
};

export default PaiCharts;
