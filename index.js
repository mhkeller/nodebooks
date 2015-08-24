var fs = require('fs');
var d3 = require('d3')
var document = require('jsdom').jsdom()
var pictureTube = require('picture-tube');
var tube = pictureTube();
tube.pipe(process.stdout);
var svg2png = require('svg2png')
// var btoa = require('btoa')
// var Inkscape = require('inkscape')

// var Canvas = require('noflo-canvas').canvas
//   , Image = Canvas.Image
//   , canvas = new Canvas(200, 200)
//   , ctx = canvas.getContext('2d');


var svg_parent = d3.select(document.body).append('div')
  .attr('id', 'svg-parent')

var svg = svg_parent.append('svg')
    .attr('width', 200)
    .attr('height', 200)

svg.append('circle')
  .attr('r', 5)
  .attr('cx', 10)
  .attr('cy', 10)
  .attr('fill', '#fff')

// Image.src = "data:image/svg+xml;base64," + btoa(svg_parent.html())

// Image.onload = function() {
//     // after this, Canvas’ origin-clean is DIRTY
// }
//     ctx.drawImage(Image, 0, 0);
//     console.log(ctx.toDataURL())
//     console.log(canvas.toDataURL())

var svg_markup = svg_parent.html()

// fs.writeFileSync('source.svg', svg_markup)
svg2png("source.svg", "dest.png", function (err) {
  if (err) {
    console.log(err)
  }
    fs.createReadStream('dest.png').pipe(tube);
});
