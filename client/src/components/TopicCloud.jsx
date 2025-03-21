import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

function TopicCloud({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 500;
    const height = 300;

    svg.attr('width', width).attr('height', height);

    const topics = d3.rollup(data, v => v.length, d => d.topic || 'Unknown');
    const words = Array.from(topics, ([text, size]) => ({ text, size: size * 10 }));

    cloud()
      .size([width, height])
      .words(words)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .fontSize(d => Math.sqrt(d.size))
      .on('end', (words) => {
        svg.selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-size', d => `${d.size}px`)
          .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
          .attr('text-anchor', 'middle')
          .attr('transform', d => `translate(${d.x + width / 2},${d.y + height / 2}) rotate(${d.rotate})`)
          .text(d => d.text)
          .transition()
          .duration(1000)
          .attr('opacity', 1);
      })
      .start();
  }, [data]);

  return <svg ref={svgRef} className="w-full"></svg>;
}

export default TopicCloud;