import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PaiCharts = ({ issues }) => {
  console.log("issues ", issues)
  //@ts-ignore
  const chartRef = useRef();

  useEffect(() => {
    if (!issues || issues.length === 0) return;

    //@ts-ignore
    const svg = d3.select(chartRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = 400;
    const margin = 50; // Extra space for labels
    const radius = Math.min(width, height) / 2;

    const normalizeSeverity = (severity) => {
      if (!severity) return 'Unknown';
      const s = severity.toLowerCase();
      if (s === 'critical') return 'Critical';
      if (s === 'high') return 'High';
      if (s === 'medium') return 'Medium';
      if (s === 'low') return 'Low';
      if (s === 'info') return 'Info';
      return 'Unknown';
    };

    const formattedData = issues
      .map(d => ({ ...d, severity: normalizeSeverity(d.severity) }))
      .filter(d => d.severity !== 'Unknown');

    const severityCounts = d3.rollups(
      formattedData,
      v => v.length,
      //@ts-ignore
      d => d.severity
    );

    const color = d3.scaleOrdinal()
      .domain(['Critical', 'High', 'Medium', 'Low', 'Info'])
      .range([
        '#8B0000', // Critical
        '#e74c3c', // High
        '#f1c40f', // Medium
        '#2ecc71', // Low
        '#53EAFD', // Info
      ]);

    const pie = d3.pie().value(d => d[1]);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 10);

    const labelArc = d3.arc().innerRadius(radius + 20).outerRadius(radius + 20);

    const g = svg
      .attr('width', width + margin * 2)
      .attr('height', height + margin * 2)
      .append('g')
      .attr('transform', `translate(${(width + margin * 2) / 2}, ${(height + margin * 2) / 2})`);

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
          .attr('transform', () => {
            //@ts-ignore
            const [x, y] = arc.centroid(d);
            return `translate(${x * 0.1}, ${y * 0.1})`;
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
      .attr('transform', d => {
        //@ts-ignore
        const [x, y] = labelArc.centroid(d);
        return `translate(${x}, ${y})`;
      })
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('fill', 'black')
      .text(d => `${d.data[0]} (${d.data[1]})`);
  }, [issues]);

  return (
    <div className='border flex flex-col justify-center items-center p-4'>
      <svg //@ts-ignore
        ref={chartRef}></svg>
      <h2>Security Issues by Severity</h2>
    </div>
  );
};

export default PaiCharts;
