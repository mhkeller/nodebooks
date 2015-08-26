var compileStylus = require('./compile-stylus.js')
var d3 = require('d3')
var d4 = require('d4')

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
  block += JSON.stringify(result, null, 2)
            .replace(/\n/g, pageFormat.br)
            .replace(/ /g, pageFormat.whitespace)

  block += pageFormat.peek.close
  return block
}

exports.lineChart = function(data, pageFormat){

  // if (opts.db && opts.query) {
  //   var ts_fn;

  //   // Also support a function for a query
  //   if (_.isFunction(opts.query)) {
  //    opts.query(function(err, queries){
  //     if (err) {
  //       console.log(err)
  //     }
  //     runQuery(queries)
  //    })
  //   } else {
  //     runQuery(opts.query)
  //   }
  // } else {
  //   makeChart()
  // }

  // makeChart()

  // function runQuery(query){
  //   if (_.isArray(query)){
  //     ts_fn = 'queries'
  //   } else {
  //     ts_fn = 'query'
  //   }
  //   opts.db[ts_fn](query, function(err, results){
  //     if (!_.isArray(results)){
  //       result = [results]
  //     }
  //     makeChart(err, results)
  //   })
  // }

  // function makeChart(err, queryResults){
  //   if (err) {
  //     console.log(err)
  //   }

  //   queryResults = queryResults || [{query: '', rows: ''}]

  // Add stylesheet
  compileStylus('./styles.styl', function(err, css){

    if (err) {
      console.log(err)
    }

    // Write the css to the `<head>` of our document
    var document = createDocWithCss(css)

    // queryResults.forEach(function(queryResult){
      
      // Give the svg a parent div
      // This is mostly for convenience so we have something to wrap our svg
      // We could also call `.html()` on this parent to get the full svg tag back
      var d3_svg_parent = d3.select(document.body).append('div')
            .attr('id', 'svg-parent-' + _.uniqueId())

      // d3_svg_parent.append('div')
      //   .classed('chart-query', true)
      //   .append('pre')
      //     .append('code')
      //       .html(function(){
      //         var result

      //         if (queryResult.query) {
      //           result = formattor(queryResult.query, {method: 'sql'})
      //         } else {
      //           result = opts.out.split('.')[0]
      //         }
      //         return result
      //       })

      // Define svg canvas
      var d3_svg_canvas = d3_svg_parent.append('svg')
            .attr('width', 960)
            .attr('height', 500)

      // Bake the chart
      opts.chartFn(d3_svg_canvas, data)

    // })

    // Render the full markup
    var markup = serializeDocument(document)

    if (opts.out) {
      var out_path = path.join('out', opts.out)
      io.fs.writeFileSync(out_path, markup)
    }

    cb(null, markup)
  })
}


// }

