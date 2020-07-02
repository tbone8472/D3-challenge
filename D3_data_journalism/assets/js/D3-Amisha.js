var svgWidth = 900;
var svgHeight = 500;
var margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 40
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var svg = d3.select("#scatter")
  .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
d3.csv("assets/data/data.csv").then(data => {
    //console.log(data);
    data.forEach(d => {
      d.age = +d.age;
      d.smokes = +d.smokes;
      d.abbr = `${d.abbr}`
      d.state = `${d.state}`;
    });
    var xLinearScale = d3.scaleLinear()
    .domain([18, d3.max(data, d => d.age)])
    .range([0, width]);
    var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.smokes))
    .range([height, 0]);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
    chartGroup.append("g")
      .call(leftAxis);
    circleGroup = chartGroup.selectAll("circles")
      .data(data)
      .enter()
      .append("g")
    circleGroup.append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "13")
        .attr("fill", "blue")
        .attr("opacity", .40);
    circleGroup.append("text")
        .text( d => d.abbr )
        .attr("x", d => xLinearScale(d.age) - 10 )
        .attr("y", d => yLinearScale(d.smokes) + 8)
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .attr("fill", "white");
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .attr("fill", "blue")
        .html(function(d) {
          return (`<strong>${d.state}<br>Age: ${d.age}<br>Smokes: ${d.smokes}<strong>`);
        });
    chartGroup.call(toolTip);
    circleGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left -5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .text("Smokes");
    chartGroup.append("text")
      .attr("y", height + margin.left)
      .attr("x", (width / 2))
      .text("Age");
}).catch(error => {
  console.log(error);
});