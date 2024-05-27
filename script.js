document.addEventListener('DOMContentLoaded', function() {
  const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

  d3.json(url).then(data => {
    const width = 960;
    const height = 600;

    const svg = d3.select("#chart")
      .attr("width", width)
      .attr("height", height);

    const tooltip = d3.select("#tooltip");

    const root = d3.hierarchy(data)
      .eachBefore(d => {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
      })
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .padding(1)(root); // Removed paddingInner and round(true)

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const cell = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
      .attr("id", d => d.data.id)
      .attr("class", "tile")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("fill", d => color(d.data.category))
      .attr("stroke", "white") // Added stroke attribute for outline
      .on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
          .attr("data-value", d.data.value)
          .style("left", (event.pageX -150) + "px")
          .style("top", (event.pageY - 250) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    cell.append("text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 10)
      .text(d => d)
      .attr("font-size", "10px");

    const categories = [...new Set(root.leaves().map(d => d.data.category))];

    const legend = d3.select("#legend")
      .append("svg")
      .attr("width", 500)
      .attr("height", 50)
      .selectAll("g")
      .data(categories)
      .enter().append("g")
      .attr("transform", (d, i) => `translate(${i * 100},0)`);

    legend.append("rect")
      .attr("class", "legend-item")
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", d => color(d));

    legend.append("text")
      .attr("x", 24)
      .attr("y", 10)
      .attr("dy", "0.35em")
      .text(d => d);
  });
});