const cities = [
    { name: "berlin", coordinates: [13.4050, 52.5200] },
    { name: "budapest", coordinates: [19.0402, 47.4979] },
    { name: "chandler", coordinates: [-112.0740, 33.4484] },
    { name: "nyc", coordinates: [-74.0060, 40.7128] },
    { name: "miami", coordinates: [-80.1918, 25.7617] },
    { name: "athens", coordinates: [-83.383331, 33.950001] },
    { name: "dc", coordinates: [-77.0369, 38.9072] },
    { name: "oxford", coordinates: [-1.25596, 51.7520] },
    { name: "seoul", coordinates: [126.9780, 37.5665] }
];

document.addEventListener("DOMContentLoaded", function() {

    const svg = d3.select(".box-places-right svg");
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const projection = d3.geoEckert4()
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    d3.json("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson")
    .then(function(geojsonData) {
        
        projection.fitSize([width, height], geojsonData);

        svg.selectAll("path")
            .data(geojsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "black");

        // Adding pins for cities
        const pins = svg.selectAll("circle")
            .data(cities)
            .enter()
            .append("circle")
            .attr("cx", d => projection(d.coordinates)[0])
            .attr("cy", d => projection(d.coordinates)[1])
            .attr("r", 5)  // Radius of the pin
            .attr("fill", "white")  // Color of the pin
            .attr("stroke", "black")  // Outline of the pin
            .attr("cursor", "pointer")  // Change cursor on hover
            .on("click", function(d) {
                window.location.href = `places.html#${d.name}`;
            });

        // Add hover text with city name
        pins.append("title")
            .text(d => d.name);

    }).catch(error => {
        console.error("Error fetching the geoJSON data:", error);
    });

});