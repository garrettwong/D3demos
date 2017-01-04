// global ref for window.resize
var treeDataRef;

// get data from json file
d3.json('treeData.json', function (err, treeData) {
    update(treeData);

    // set global json data ref
    treeDataRef = treeData;
});

// resize event
d3.select(window).on('resize', resize);

function resize() {
    if (!treeDataRef) return;

    d3.select('svg').selectAll("*").remove();

    update(treeDataRef);
}


/**
    generation of the tree graph code 
*/

// set the dimensions and margins of the diagram
var margin = 40,
    sizeReductionFactor = 1.5;

function update(treeData) {
    var width = parseInt(d3.select('html').style('width')) / sizeReductionFactor - margin * 2,
        height = parseInt(d3.select('html').style('height')) / sizeReductionFactor - margin * 2;

    console.log(width, height);

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
        .size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("svg")
        .attr("width", width + margin * 2)
        .attr("height", height + margin * 2),
        g = svg.append("g")
            .attr("transform",
            "translate(" + margin + "," + margin + ")");

    // adds the links between the nodes
    var link = g.selectAll(".link")
        .data(nodes.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function (d) {
            console.log(d);

            return "M" + d.x + "," + d.y
                + "C" + d.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                + " " + d.parent.x + "," + d.parent.y;
        });

    // adds each node as a group
    var node = g.selectAll(".node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", function (d) {
            return "node" +
                (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .on('click', openUrl);

    function openUrl(d, i) {
        console.log(d, i);
        // open url
        if (d.data.url) {
            window.open(d.data.url);
        } else {
            alert('No url defined');
        }
    }

    // adds the circle to the node
    node.append("circle")
        .attr("r", 10)
        .style('fill', function (d) { 
            var r = Math.random();
            if (r > 0.5) return '#1f77b4';
            return '#97b30c';
        });

    // adds the text to the node
    node.append("text")
        .attr("dy", ".35em")
        .attr("y", function (d) { return d.children ? -20 : 20; })
        .style("text-anchor", "middle")
        .text(function (d) { return d.data.name; });
}