const width = 300;
const height = 300;

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

const projection = d3.geoOrthographic()
    .scale(112)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(0.1);

const path = d3.geoPath().projection(projection);

function drawPins(svg, pins) {
    svg.selectAll(".pin").remove();

    const pinPositions = pins.map(({ name, coordinates }) => {
        const position = projection(coordinates);
        return {
            position,
            name,
            visible: position !== null
        };
    });

    svg.selectAll("circle.pin")
        .data(pinPositions)
        .enter()
        .filter(({ visible }) => visible)
        .append("circle")
        .attr("class", "pin")
        .attr("cx", d => d.position[0])
        .attr("cy", d => d.position[1])
        .attr("r", 5)
        .attr("cursor", "pointer")
        .on("click", ({ name }) => {
            window.location.href = `places.html#${name}`;
        });
}

document.addEventListener("DOMContentLoaded", function () {
    const svg = d3.select("#mapContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson")
        .then(data => {
            svg.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", "#000");

            drawPins(svg, cities);

            svg.call(d3.drag()
                .on("start", function () {
                    const [x, y] = d3.mouse(this);
                    const { width, height } = d3.select("#mapContainer").node().getBoundingClientRect();

                    if (x < 0 || x > width || y < 0 || y > height) {
                        d3.event.sourceEvent.stopPropagation();
                        return;
                    }

                    this.__chart__ = {
                        rotate: projection.rotate(),
                        scale: projection.scale()
                    };
                })
                .on("drag", function () {
                    const { dx, dy } = d3.event;
                    const rotate = projection.rotate();
                    const sensitivity = 0.25;

                    projection.rotate([
                        rotate[0] + dx * sensitivity,
                        rotate[1] - dy * sensitivity,
                        rotate[2]
                    ]);

                    svg.selectAll("path").attr("d", path);
                    drawPins(svg, cities);
                }));
        })
        .catch(console.error);
});
