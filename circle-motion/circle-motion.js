function circleChart() {
    var JSONData = [
        new ball(250, 101, -3, -5, 20, 'blue'),
        new ball(255, 125, 1, -14, 9, 'silver'),
        new ball(260, 233, -21, 3, 24, 'gold'),
        new ball(275, 241, 1, 4, 35, 'orange'),
        new ball(240, 351, -1, -17, 15, 'green'),
        new ball(230, 361, 12, 1, 3, 'red'),
    ];

    var grid = {
        width: 600,
        height: 500
    };
    var AppState = {
        transitionOn: true,
        
        updateInterval: 1000,
        
        onCollisionIncreaseRate: 1.01
    };

    function ball(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
    }

    (function () {
        // circleData
        var circleData = JSONData.slice();

        // format
        var format = d3.time.format("%a %b %d %Y");
        var dateFn = function (d) { return format.parse(d.created_at) };

        // x axis - linear
        var x = d3.scale.linear()
            .range([0, 100]);

        // y axis - linear
        var y = d3.scale.linear()
            .range([0, 100]);

        // setup d3 grid
        var svg = d3.select("#demo").append("svg:svg")
            .attr("width", grid.width)
            .attr("height", grid.height);

        var border = 5;
        var bordercolor = "#9292cc";
        var borderPath = svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", grid.width)
            .attr("height", grid.height)
            .style("stroke", bordercolor)
            .style("fill", "#f2f2f2")
            .style("stroke-width", border);

        var refreshGraph = function () {
            circleData = update(circleData);
            console.log('refreshGraph', circleData);

            svg.selectAll("circle")
                .data(circleData)
                .enter()
                .append("svg:circle")

                .attr("r", function (d) { return d.radius })
                .attr("cx", function (d) { console.log('cx!'); return d.x; })
                .attr("cy", function (d) { return d.y; })

                .on("click", function (d, i) {
                    d3.select(this).transition()
                        .delay(250)
                        .attr("cy", function (d) {
                            d.y += 50;
                            return d.y
                        })
                        .style("fill", "purple");
                })
                .on("mouseover", function (d, i) {
                    alert('you lose!');

                    d3.select(this).style("fill", "red")
                        .transition()
                        .delay(250)
                        .attr("cx", function (d) {
                            d.x += 50;
                            return d.x;
                        });
                })
                .on("mouseout", function (d, i) {

                    d3.selectAll("circle").style("fill", "teal");
                })

                .transition().each("end", function () {
                    circleTransition();
                });
        };

        function circleTransition() {

            // movement or no movement
            if (!AppState.transitionOn) {
                d3.selectAll('circle').transition().duration(AppState.updateInterval)
                    .each("end", function () {
                        circleTransition();
                    });
            } else {
                d3.selectAll('circle').transition().duration(AppState.updateInterval)
                    .attr("cx", function (d) {
                        // for(var i = 0; i < circleData.length; i++) {
                        //     if (isCollision(d, circleData[i])) {
                        //         d.vx = d.vx * -AppState.onCollisionIncreaseRate;
                        //     }
                        // }
                        d.x += d.vx;

                        if (d.x < 0 || d.x > grid.width) {
                            d.vx *= -AppState.onCollisionIncreaseRate;
                        }
                        
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        // for(var i = 0; i < circleData.length; i++) {
                        //     if (isCollision(d, circleData[i])) {
                        //         d.vy = d.vy * -1.1;
                        //     }
                        // }
                        d.y += d.vy;

                        if (d.y < 0 || d.y > grid.height) {
                            d.vy *= -AppState.onCollisionIncreaseRate;
                        }

                        return d.y;
                    })
                    .style("fill", function (d) { return d.color; })
                    // .attr("cy", Math.random() * 500) // change this to random 2px
                    .each("end", function () {
                        // recurse
                        circleTransition();
                    });
            }
        }

        //http://cgp.wikidot.com/circle-to-circle-collision-detection
        function isCollision(c1, c2) {
            //compare the distance to combined radii
            var dx = c2.x - c1.x;
            var dy = c2.y - c1.y;
            var radii = c1.radius + c2.radius;
            if ( ( dx * dx )  + ( dy * dy ) < radii * radii ) 
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        var update = function (circleData) {
            for (var i = 0; i < circleData.length; i++) {
                var circle = circleData[i];

                circle.x += circle.vx;
                circle.y += circle.vy;
            }
            return circleData;
        };

        var imgs = svg.selectAll("image").data([0]);
        imgs.enter()
            .append("svg:image")
            .attr("xlink:href", "cat.png")
            .attr("x", "60")
            .attr("y", "60")
            .attr("width", "50")
            .attr("height", "50")

            .transition().each("end", function () {
                imageTransition();
            });

        function imageTransition() {
            console.log('transit');

            var img = d3.selectAll('image');

            // movement or no movement
            if (!AppState.transitionOn) {
                d3.selectAll('image').transition()
                    .duration(AppState.updateInterval)
                    .each("end", function () {
                        imageTransition();
                    });
            } else {
                d3.selectAll('image').transition().duration(AppState.updateInterval)
                    .attr("x", function (d) {
                        console.log(d);

                        d += 15;

                        return d;
                    })
                    .attr("y", function (d) {
                        d += 55;

                        return d;
                    })
                    .each("end", function () {
                        imageTransition();
                    });
            }
        }

        // click events
        d3.selectAll("#add-data")
            .on("click", function () {
                var obj = new ball(61, Math.floor(50 + Math.random() * 1), 1, 1, 20, 'lime');

                circleData.push(obj);

                refreshGraph();
            });
        d3.selectAll('#btnStopMotion')
            .on('click', function () {
                AppState.transitionOn = false;
            });
        d3.selectAll('#btnStartMotion')
            .on('click', function () {
                AppState.transitionOn = true;
            });

        refreshGraph();
        // setInterval(refreshGraph, 500);
    })();
}


