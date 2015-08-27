var compileStylus = require('./compile-stylus.js')
var jsdom = require('jsdom')
var d3 = require('d3')
var d4 = require('d4')
var _ = require('underscore')

var helpers = {}

helpers.parseNestedDataBy = function(data, conf){
  return d4.parsers.nestedGroup()
          .x(function(){
            return conf.x
          })
          .nestKey(function(){
            return conf.nestKey
          })
          .y(function(){
            return conf.y
          })
          .value(function(){
            return conf.value
          })(data)
}

helpers.chartBy = function(conf) {
  var width = conf.width || 960
  return d4.charts.line()
          .outerWidth(width)
          .x(function(x){
            x.key(conf.x);
          })
          .y(function(y){
            y.key(conf.y);
          })
}

exports.js = function(result, pageFormat){
  var block = pageFormat.peek.open
  block += JSON.stringify(JSON.parse(result), null, 2)
            .replace(/\n/g, pageFormat.br)
            .replace(/ /g, pageFormat.whitespace)

  block += pageFormat.peek.close
  return block
}

exports.nestedLineChart = function(result){
  var opts = JSON.parse(result)
  var helpers = {}

  helpers.parseNestedDataBy = function(data, conf){
    return d4.parsers.nestedGroup()
            .x(function(){
              return conf.x
            })
            .nestKey(function(){
              return conf.nestKey
            })
            .y(function(){
              return conf.y
            })
            .value(function(){
              return conf.value
            })(data)
  }

  helpers.chartBy = function(conf) {
    var width = conf.width || 960
    return d4.charts.line()
            .outerWidth(width)
            .x(function(x){
              x.key(conf.x);
            })
            .y(function(y){
              y.key(conf.y);
            })
  }

  var document = jsdom.jsdom()
      
  // Give the svg a parent div
  // This is mostly for convenience so we have something to wrap our svg
  // We could also call `.html()` on this parent to get the full svg tag back
  var d3_svg_parent = d3.select(document.body).append('div')
        .attr('id', 'svg-parent-' + _.uniqueId())

  // Define svg canvas
  var d3_svg_canvas = d3_svg_parent.append('svg')
        .attr('width', 960)
        .attr('height', 500)

  // Bake the chart
  // opts.chartFn(d3_svg_canvas, opts.parsedData)

  if (opts.parseDate) {
    opts.data.forEach(function(row){
      row[opts.x] = d3.time.format(opts.parseDate).parse(row[opts.x])
    })
    // Sort by day of week
    opts.data = _.sortBy(opts.data, opts.x)
  }


  var parsedData = helpers.parseNestedDataBy(opts.data, {
    x: opts.x,
    y: opts.y,
    value: opts.y,
    nestKey: opts.nestKey
  })

  d3_svg_canvas
    .datum(parsedData.data)
    .call(helpers.chartBy({
      x: opts.x,
      y: opts.y
    }));

  // Render the full markup
  var markup = document.body.innerHTML

  return markup
}


// }

