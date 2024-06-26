
d3.csv("data/mock_stock_data.csv").then(data => {
    data.forEach(d => { d.date = new Date(d.date); d.price = +d.price; });
  

    let stockNames = [...new Set(data.map(d => d.stock))];

    let stockFilter = d3.select("#stockFilter");
    stockNames.forEach(stock => stockFilter.append("option").text(stock).attr("value", stock));

    drawChart(data);
    ["#stockFilter", "#startDate", "#endDate"].forEach(id => d3.select(id).on("change", () => updateChart(data)));
});