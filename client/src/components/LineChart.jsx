import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function LineChart({ data, metric = 'intensity' }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };

    svg.attr('width', width).attr('height', height);

    const filteredData = data.filter(d => d.end_year && !isNaN(parseInt(d.end_year)));
    const years = [...new Set(filteredData.map(d => d.end_year))].sort();

    const x = d3.scalePoint()
      .domain(years.length ? years : ['N/A'])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d[metric])])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x((d) => x(d.end_year || 'N/A'))
      .y((d) => y(d[metric]))
      .defined(d => d.end_year && !isNaN(parseInt(d.end_year)));

    const path = svg.append('path')
      .datum(filteredData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('d', line);

    const totalLength = path.node().getTotalLength();
    path.attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .attr('stroke-dashoffset', 0);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }, [data, metric]);

  return <svg ref={svgRef} className="w-full"></svg>;
}

export default LineChart;