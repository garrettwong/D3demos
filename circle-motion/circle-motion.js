function circleChart() {
    $('svg').remove();

    var JSONData = [
        new Ball(250, 101, -3, -3, 20, 'blue'),
        new Ball(255, 125, 1, -10, 9, 'silver'),
        new Ball(260, 233, -21, 3, 24, 'gold'),
        new Ball(275, 241, 1, 4, 35, 'orange'),
        new Ball(240, 351, -1, -12, 15, 'green'),
        new Ball(230, 361, 12, 1, 3, 'red'),
    ];

    var grid = {
        width: 600,
        height: 500
    };

    var AppState = {
        transitionOn: true,
        
        updateInterval: 100,

        imageUpdateInterval: 5,
        
        onCollisionIncreaseRate: 1.01,

        gameOver: false
    };

    var image1 = new Image(50, 50, 50, 50, 'cat.png');
    
    
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
            .style("fill", "transparent") // .style("fill", "#f2f2f2")
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
            if (AppState.gameOver) return;

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
            .attr("xlink:href", image1.url)
            .attr("x", image1.x)
            .attr("y", image1.y)
            .attr("width", "50")
            .attr("height", "50")

            .transition().each("end", function () {
                imageTransition();
            });

        function imageTransition() {
            // update image1 positions
            if (AppState.gameOver) return;
            updateImage();
            checkImageCollision();

            var img = d3.selectAll('image');

            // movement or no movement
            if (!AppState.transitionOn) {
                d3.selectAll('image').transition()
                    .duration(AppState.imageUpdateInterval)
                    .each("end", function () {
                        imageTransition();
                    });
            } else {
                d3.selectAll('image').transition().duration(AppState.imageUpdateInterval)
                    .attr("x", function (d) {
                        d = image1.x;

                        return d;
                    })
                    .attr("y", function (d) {
                        d = image1.y;

                        return d;
                    })
                    .each("end", function () {
                        imageTransition();
                    });
            }
        }
        function updateImage() {
            var KEYMAP = {
                A: 65,
                D: 68,
                W: 87,
                S: 83,

                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40
            };

            // Left
            if (pressedKeys[KEYMAP.A] === 1) {
                if (image1.x > 0) {
                    image1.x -= 10;
                }
            }
            if (pressedKeys[KEYMAP.D] === 1) {
                if (image1.x + image1.width < grid.width) {
                    image1.x += 10;
                }
            }
            if (pressedKeys[KEYMAP.W] === 1) {
                if (image1.y > 0) {
                    image1.y -= 10;
                }
            }
            if (pressedKeys[KEYMAP.S] === 1) {
                if (image1.y + image1.height < grid.height) {
                    image1.y += 10;
                }
            }
        }
        function checkImageCollision() {
            var image = image1;
            var circle1 = {radius: image.width/2, x: image.x + (image.width/2), y: image.y + (image.width/2) };

            for (var i = 0; i < circleData.length; i++) {
                var c = circleData[i];

                var dx = circle1.x - c.x;
                var dy = circle1.y - c.y;
                var distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < circle1.radius + c.radius) {
                    // collision detected!
                    console.log('collis');
                    AppState.gameOver = true;
                }
            }
        }

        // click events
        d3.selectAll("#add-data")
            .on("click", function () {
                var obj = new Ball(61, Math.floor(50 + Math.random() * 1), 1, 1, 20, 'lime');

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

        var score = 0;
        var intervalId = setInterval(function() {
            if (!AppState.gameOver) {
                $('h1').html(score);

                score+= 1;
            } else {
                Scoreboard.add(score-1);
                refreshScoreboard();

                clearInterval(intervalId);
            }
        }, 200);
    })();
}