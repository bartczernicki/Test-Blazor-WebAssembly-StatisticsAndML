function countUnique(iterable) {
    return new Set(iterable).size;
}

function createD3SvgObject(data, mean, title) {

    console.log(data);
    //https://datacadamia.com/viz/d3/histogram#instantiation
    //http://bl.ocks.org/nnattawat/8916402


    var svgTest = d3.select("#my_dataviz");
    svgTest.selectAll("*").remove();

    min = 0; //d3.min(data);
    max = d3.max(data);
    domain = [min, max];

    var margin = { top: 30, right: 30, bottom: 30, left: 50 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // The number of bins 
    Nbin = max; //countUnique(data);

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

    var color = "steelblue";
    var yBinMin = d3.min(bins, function (d) { return d.length });
    var yBinMax = d3.max(bins, function (d) { return d.length });
    var colorScale = d3.scaleLinear()
        .domain([yBinMin, yBinMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    // Add the svg element to the body and set the dimensions and margins of the graph
    var svg = d3
        .select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style('background-color', 'WhiteSmoke')
        .append("g")
            .attr('class', 'bars')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));



    // Add 10% to Y-axis
    var yMax = 1.1*d3.max(bins, function (d) {
        return d.length;});

    var y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([
            0, yMax
        ]);

    svg.append("g").call(d3.axisLeft(y));

    // Only render bins/visual elements that are non-zero
    var binsNonZero = bins.filter(bins => bins.length > 0);

    // Add bars
    var bar = svg.selectAll(".bar")
        .data(binsNonZero)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(0) + ")"; });

    bar.append("rect")
        .attr("x", function (d) {
            return -(x(d.x1) - x(d.x0)) / 2 + 1;
        })
        .attr("width", function (d) {
            return x(d.x1) - x(d.x0) - 1;
        })
        //.attr("height", function (d) {
        //    return height - y(d.length);
        //})
        .attr("height", function (d) {
            return 0;
        })
        .style("fill", function (d) {
            return colorScale(d.length)
        });


    svg.selectAll("rect")
        .transition()
        .duration(100)
        .attr("height", function (d) { return height - y(d.length); })
        .delay(function (d, i) {
            //console.log(i + " - " + (height - y(d.length)));
            return (i * 50);
        })
    svg.selectAll(".bar")
        .transition()
        .duration(100)
        .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .delay(function (d, i) {
            // console.log(i + " - " + (height - y(d.length)));
            return (i * 50);
        })

    //bar.append("text")
    //    .attr("dy", ".75em")
    //    .attr("y", -10)
    //    .attr("x", function (d) { return (d.x1 - d.x0); })
    //    .attr("dx", ".5em")
    //    .style("font-size", "10px")
    //    .text(function (d) { if (d.length > 0) { return d.length } });

    // Add line for mean
    svg
        .append("line")
        .attr("x1", x(mean))
        .attr("x2", x(mean))
        .attr("y1", y(0))
        .attr("y2", y(yMax))
        .attr("stroke", "grey")
        .attr("stroke-dasharray", "4")
    // Add text for mean label
    svg
        .append("text")
        .attr("x", x(mean) + 2)
        .attr("y", y(yMax) + 10)
        .text("Distribution Mean: " + mean)
        .style("font-size", "10px")


    svg
        .append("text")
        .attr("class", "title")
        .attr("x", width / 2) //positions it at the middle of the width
        .attr("y", -margin.top / 3) //positions it from the top by the margin top
        .attr("font-family", "'Monotype Corsiva','Apple Chancery','ITC Zapf Chancery','URW Chancery L',cursive")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text(title);
}