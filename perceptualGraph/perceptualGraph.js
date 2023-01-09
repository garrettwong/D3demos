var data = [
  {
    name: 'HSL Rainbow',
    labelOffset: 60,
    value: function (t) {
      return d3.hsl(t, 1, 0.5)
    },
  },
  {
    name: 'HCL Rainbow',
    labelOffset: 20,
    value: function (t) {
      return d3.hsl(t, 1, 0.15)
    },
  },
  {
    name: 'Cubehelix Rainbow',
    labelOffset: 40,
    value: d3.scaleSequential(function (t) {
      return d3.hsl(t * 360, 1, 0.5) + ''
    }),
  },
].map(function (color) {
  return (
    (color.deltas = d3.range(0, 360, 3).map(function (x) {
      return {
        input: x,
        delta: delta(color.value(x - 10), color.value(x + 10)),
      }
    })),
    color
  )
})

var margin = { top: 20, right: 20, bottom: 30, left: 30 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom

var x = d3.scaleLinear().domain([0, 360]).range([0, width])

var y = d3.scaleLinear().domain([0, 80]).range([height, 0])

var z = d3.scaleOrdinal(d3.schemeCategory10)

var line = d3
  .line()
  .curve(d3.curveBasis)
  .x(function (d) {
    return x(d.input)
  })
  .y(function (d) {
    return y(d.delta)
  })

// axises
var svg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

svg
  .append('g')
  .attr('class', 'axis axis--x')
  .attr('transform', 'translate(0,' + y(0) + ')')
  .call(d3.axisBottom(x))

svg
  .append('g')
  .attr('class', 'axis axis--y')
  .call(d3.axisLeft(y))
  .selectAll('.tick:last-of-type')
  .append('text')
  .attr('class', 'axis-title')
  .attr('x', 3)
  .attr('dy', '.32em')
  .text('Color Difference at ±10° (CIE76)')

// gradient
var gradient = svg
  .append('defs')
  .append('linearGradient')
  .attr('id', 'gradient')
  .attr('x1', '0%')
  .attr('y1', '0%')
  .attr('x2', '100%')
  .attr('y2', '100%')
  .attr('spreadMethod', 'pad')

gradient
  .append('stop')
  .attr('offset', '0%')
  .attr('stop-color', '#04c')
  .attr('stop-opacity', 1)

gradient
  .append('stop')
  .attr('offset', '100%')
  .attr('stop-color', '#c00')
  .attr('stop-opacity', 1)

// append background with hover rectangle
var prevX = 0 // cursor to track previous x position

svg
  .append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', width)
  .attr('height', height)
  .attr('fill', '#fff')
  .on('mousemove', function (d, i) {
    let x = d3.mouse(this)[0]

    highlightRect.attr('x', function (d, i) {
      return x
    })

    highlightRect.attr('fill', function (d, i) {
      if (x % 3 === 0) {
        return '#4488cc'
      }
      if (x % 4 === 0) {
        return '#9944cc'
      }
      return 'cc9922'
    })
    highlightRectText.attr('x', function (d, i) {
      return x - 10
    })

    // temp gradient
    var tempRectWidth = 200
    var tempRect = bar
      .append('rect')
      .attr('x', function (d, i) {
        let newX
        if (prevX < x) newX = x - tempRectWidth
        // if we are moving right
        else newX = x // if we are moving left

        prevX = x
        return newX
      })
      .attr('y', 0)
      .attr('width', tempRectWidth)
      .attr('height', height)
      .style('fill', 'url(#gradient)')
      .transition()
      .delay(100)
      .style('fill', 'none')
      .remove()
  })

var bar = svg.append('g').attr('transform', function (d, i) {
  return 'translate(0, ' + i * height + ')'
})
var highlightRect = bar
  .append('rect')
  .attr('x', -10)
  .attr('y', 0)
  .attr('width', 2)
  .attr('height', height)
  .attr('fill', '#777')

var highlightRectText = bar
  .append('text')
  .attr('x', 0)
  .attr('dy', -5)
  .style('fill', function (d, i) {})
  .text(function (d) {
    console.log(d)
    return 'AB'
  })
// end highlightRect

var g = svg
  .selectAll('.line')
  .data(data)
  .enter()
  .append('g')
  .attr('class', 'line')

g.append('path')
  .attr('d', function (d) {
    return line(d.deltas)
  })
  .attr('id', function (d, i) {
    return 'path-' + i
  })
  .style('stroke', function (d, i) {
    return z(i)
  })

g.append('text')
  .attr('x', function (d) {
    return d.labelOffset
  })
  .attr('dy', -5)
  .style('fill', function (d, i) {
    return d3.lab(z(i)).darker()
  })
  .append('textPath')
  .attr('class', 'textpath')
  .attr('xlink:href', function (d, i) {
    return '#path-' + i
  })
  .text(function (d) {
    return d.name
  })

// CIE76 per https://en.wikipedia.org/wiki/Color_difference#CIE76
// Not as good as CIEDE2000 but a lot easier to implement.
function delta(a, b) {
  var dl = (a = d3.lab(a)).l - (b = d3.lab(b)).l,
    da = a.a - b.a,
    db = a.b - b.b
  return Math.sqrt(dl * dl + da * da + db * db)
}
