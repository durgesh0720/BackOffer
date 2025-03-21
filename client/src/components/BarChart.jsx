import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BarChart({ data, onBarClick, metric = 'intensity', xField = 'country' }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 70, left: 40 };

    svg.attr('width', width).attr('height', height);

    const x = d3.scaleBand()
      .domain(data.map((d) => d[xField] || 'Unknown'))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d[metric])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d[xField] || 'Unknown'))
      .attr('width', x.bandwidth())
      .attr('y', height - margin.bottom)
      .attr('height', 0)
      .attr('fill', 'steelblue')
      .on('mouseover', function () { d3.select(this).attr('fill', 'orange'); })
      .on('mouseout', function () { d3.select(this).attr('fill', 'steelblue'); })
      .on('click', (event, d) => onBarClick(d))
      .transition()
      .duration(750)
      .attr('y', (d) => y(d[metric]))
      .attr('height', (d) => height - margin.bottom - y(d[metric]));
  }, [data, onBarClick, metric, xField]);

  return <svg ref={svgRef} className="w-full"></svg>;
}

export default BarChart;