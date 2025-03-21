import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

function TopicCloud({ data, onTopicClick }) {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Get container dimensions for responsiveness
    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = 300;

    svg.attr('width', width).attr('height', height);

    // Prepare word cloud data
    const topics = d3.rollup(data, (v) => v.length, (d) => d.topic || 'Unknown');
    const words = Array.from(topics, ([text, size]) => ({
      text,
      size: Math.max(20, Math.min(60, Math.sqrt(size * 100))), // Scale size with min/max bounds
    }));

    // Color scale based on topic text for consistency
    const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(words.map((d) => d.text));

    // Tooltip setup
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Word cloud layout
    cloud()
      .size([width, height])
      .words(words)
      .padding(8) // Increased padding for better spacing
      .rotate(() => (Math.random() > 0.5 ? 0 : 90)) // Simpler rotation logic
      .font('Arial') // Consistent font
      .fontSize((d) => d.size)
      .on('end', (computedWords) => {
        const g = svg
          .append('g')
          .attr('transform', `translate(${width / 2},${height / 2})`);

        const text = g
          .selectAll('text')
          .data(computedWords)
          .enter()
          .append('text')
          .style('font-size', (d) => `${d.size}px`)
          .style('font-family', 'Arial')
          .style('fill', (d) => colorScale(d.text))
          .attr('text-anchor', 'middle')
          .attr('transform', (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
          .attr('opacity', 0)
          .text((d) => d.text);

        // Animation: Fade in and slight initial bounce
        text
          .transition()
          .duration(1000)
          .attr('opacity', 1)
          .attr('y', (d) => d.y - 10) // Slight bounce effect
          .transition()
          .duration(300)
          .attr('y', (d) => d.y);

        // Interactivity: Hover and Click
        text
          .on('mouseover', function (event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .style('font-size', `${d.size * 1.1}px`) // Scale up on hover
              .style('fill', d3.color(colorScale(d.text)).brighter(1));
            tooltip
              .style('opacity', 1)
              .html(`${d.text}: ${topics.get(d.text)} occurrences`)
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 28}px`);
          })
          .on('mouseout', function (event, d) {
            d3.select(this)
              .transition()
              .duration(200)
              .style('font-size', `${d.size}px`)
              .style('fill', colorScale(d.text));
            tooltip.style('opacity', 0);
          })
          .on('click', (event, d) => {
            if (onTopicClick) onTopicClick(d.text); // Callback for topic selection
          });
      })
      .start();

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [data, onTopicClick]);

  return (
    <div ref={containerRef} className="w-full">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
}

export default TopicCloud;