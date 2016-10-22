import * as d3 from "d3";


// This is the chart function that will be exported
export default () => ({

  // Develop the reusable function for you chart in this init function.
  // cf. https://bost.ocks.org/mike/chart/
  init: function() {

    // Default chart properties
    var stroke = '#eee';

    // Inner chart function
    function chart(selection){
      selection.each(function(data){

        var bbox = this.getBoundingClientRect();
        var width = bbox.width < bbox.height ? bbox.width : bbox.height;
        var height = width;
        var t = d3.transition()
            .duration(750);


        // Check if we've already appended our SVG.
        var g = d3.select(this).select('svg').select('g').size() === 0 ?
          d3.select(this).append("svg")
              .attr("width", width)
              .attr("height", height)
              .style("display", "block")
              .style("margin", "auto")
            .append("g") :
          d3.select(this).select('svg').select('g');

        var circles = g.selectAll("circle")
            .data(data, function(d, i){ return i; });

        circles.transition(t)
          .attr("fill", "#0f516e");

        circles.enter().append('circle') // Enter
            .attr("fill","#FF7216")
            .attr("cy", "60")
            .attr("stroke", stroke)
            .attr('cx',function(d, i){
              function add(a,b){return a + b;}
              return data.slice(0, i).reduce(add, 0) + d/2;
            })
          .merge(circles)
            .transition(t)
            .attr('cx',function(d, i){
              function add(a,b){return a + b;}
              return data.slice(0, i).reduce(add, 0) + d/2;
            })
            .attr("r", function(d){
              return d/2;
            });

      });
    }

    // Getter-setters
    chart.stroke = function(_){
      if (!arguments.length) return stroke;
      stroke = _;
      return chart;
    };

    return chart;
  },


  // This function actually draws the chart using the
  // reusable init function.
  draw: function(){
    var chart = this.init()
        .stroke(this._stroke);

    d3.select(this._selection)
      .datum(this._data)
      .call(chart);
  },

  // Call this function to initially create the chart.
  create: function(selection, data, stroke){
    this._selection = selection;
    this._data = data;
    this._stroke = stroke;

    this.draw();
  },

  // This updates the data and elements.
  update: function(data){
    this._data = data;

    this.draw();
  }
});
