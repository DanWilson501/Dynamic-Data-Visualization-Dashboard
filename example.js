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