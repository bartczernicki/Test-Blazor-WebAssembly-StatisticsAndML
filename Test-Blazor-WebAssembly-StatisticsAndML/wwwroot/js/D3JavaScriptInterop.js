function countUnique(iterable) {
    return new Set(iterable).size;
}

function createD3SvgObject(data) {

    console.log(data);
    //https://datacadamia.com/viz/d3/histogram#instantiation

    var svgTest = d3.select("#my_dataviz");
    svgTest.selectAll("*").remove();

    //data = [1, 2, 3, 8, 7, 4, 9, 8, 7, 3, 4, 5, 2, 1, 9, 7, 8, 4, 0, 2, 3, 8, 7, 6];
    min = d3.min(data);
    max = d3.max(data);
    domain = [min, max];

    var margin = { top: 30, right: 30, bottom: 30, left: 50 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // The number of bins 
    Nbin = countUnique(data);

    var x = d3
        .scaleLinear()
        .domain(domain)
        .range([0, width]);

    var histogram = d3
        .histogram()
        .domain(x.domain()) // then the domain of the graphic
        .thresholds(x.ticks(Nbin)); // then the numbers of bins

    // And apply this function to data to get the bins
    var bins = histogram(data);

    // Add the svg element to the body and set the dimensions and margins of the graph
    var svg = d3
        .select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    var y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([
            0,
            d3.max(bins, function (d) {
                return d.length;
            })
        ]);

    svg.append("g").call(d3.axisLeft(y));

    svg
        .selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")";
        })
        .attr("width", function (d) {
            return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function (d) {
            return height - y(d.length);
        })
        .style("fill", "#69b3a2");
}