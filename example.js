// U5223-1368

d3.csv("data/mock_stock_data.csv").then(data => {
    data.forEach(d => { d.date = new Date(d.date); d.price = +d.price; });
  
    let stockNames = [...new Set(data.map(d => d.stock))];
  
    let stockFilter = d3.select("#stockFilter");
    stockNames.forEach(stock => stockFilter.append("option").text(stock).attr("value", stock));
  
    drawChart(data);
    ["#stockFilter", "#startDate", "#endDate"].forEach(id => d3.select(id).on("change", () => updateChart(data)));
  
    function updateChart(data) {
      let selectedStock = stockFilter.property("value"),
          startDate = d3.select("#startDate").property("value") ? new Date(d3.select("#startDate").property("value")) : null,
          endDate = d3.select("#endDate").property("value") ? new Date(d3.select("#endDate").property("value")) : null;
  
      let filteredData = data.filter(d => 
        (!selectedStock || d.stock === selectedStock) &&
        (!startDate || d.date >= startDate) &&
        (!endDate || d.date <= endDate)
      );
  
      drawChart(filteredData);
    }
  });

   function drawChart(data) {
    d3.select("#chart").html("");
  
    const margin = { top: 20, right: 30, bottom: 70, left: 50 },
          width = 600 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;
  
    let svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    let x = d3.scaleTime().domain(d3.extent(data, d => d.date)).range([0, width]),
        y = d3.scaleLinear().domain([0, d3.max(data, d => d.price)]).range([height, 0]),
        line = d3.line().x(d => x(d.date)).y(d => y(d.price)),
        color = d3.scaleOrdinal(d3.schemeCategory10),
        nestedData = d3.group(data, d => d.stock);
  
    svg.append("g").attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat("%Y-%m-%d")))
      .selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", "rotate(-40)");
  
    svg.append("g").call(d3.axisLeft(y));
  
    for (let [key, value] of nestedData) {
      svg.append("path").datum(value).attr("fill", "none").attr("stroke", color(key)).attr("stroke-width", 1.5).attr("d", line);

      for (let [key, value] of nestedData) {
        svg.append("path").datum(value).attr("fill", "none").attr("stroke", color(key)).attr("stroke-width", 1.5).attr("d", line);
    
        svg.selectAll(`.circle-${key}`).data(value).enter().append("circle")
          .attr("r", 4).attr("cx", d => x(d.date)).attr("cy", d => y(d.price)).attr("fill", color(key))
          .on("mouseover", (event, d) => tooltip.html(`Stock: ${d.stock}<br>Date: ${d.date.toISOString().split('T')[0]}<br>Price: $${d.price}`).style("visibility", "visible"))
          .on("mousemove", event => tooltip.style("top", `${event.pageY - 10}px`).style("left", `${event.pageX + 10}px`))
          .on("mouseout", () => tooltip.style("visibility", "hidden"));
      }
    
      let tooltip = d3.select("body").append("div").style("position", "absolute").style("visibility", "hidden").attr("class", "tooltip");
    }
}