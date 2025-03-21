import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function PieChart({ data, field = 'sector' }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const counts = d3.rollup(data, v => v.length, d => d[field] || 'Unknown');
    const pieData = Array.from(counts, ([key, count]) => ({ key, count }));
    const total = d3.sum(pieData, d => d.count);

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(radius - 20);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const arcs = g.selectAll('.arc')
      .data(pie(pieData))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.data.key))
      .on('mouseover', function (event, d) {
        d3.select(this).transition().duration(200).attr('d', d3.arc().innerRadius(0).outerRadius(radius - 10));
        tooltip.style('opacity', 1)
          .html(`${d.data.key}: ${d.data.count} (${((d.data.count / total) * 100).toFixed(1)}%)`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration(200).attr('d', arc);
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(750)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(i(t));
      });

    arcs.append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text((d) => d.data.key.slice(0, 10))  // Truncate for readability
      .style('font-size', '12px')
      .style('fill', 'white');
  }, [data, field]);

  return <svg ref={svgRef} className="w-full"></svg>;
}

export default PieChart;