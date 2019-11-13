import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { withRouter } from 'react-router-dom';

class SessionChartPolarAM extends React.Component {
  state = {
    session: {},
    isLoading: true,
    chartConfig: {
      divId: 'polarChartDiv',
      max: this.props.data.maxPolarForce,
      series: this.props.data.polarDataFull,
      width: this.props.width,
      bg: this.props.bg
    }
  };

  componentDidMount = async () => {
    try {

      // build the chart
      //console.log("this.props.data.maxPolarForce: ", this.props.data.maxPolarForce);
      // let maxValue = this.getLargestForce(this.props.data.polarDataFull);
      //console.log("calculated maxPolarForce: ", maxValue);

      this.createPolar(this.state.chartConfig);
      this.setState({ isLoading: false });

    } catch (err) {
      console.log('error: ' + err);
    }
  };

  componentDidUpdate(prevProps) {

    // if zoom level has changed re-render the polar chart
    if(this.state.chartConfig.series.length !== this.props.data.polarDataFull.length){

      this.setState({ isLoading: true });

      let largestForce = this.getLargestForce(this.props.data.polarDataFull);

      this.setState({ 
        chartConfig: {
          ...this.state.chartConfig,
          series: this.props.data.polarDataFull,
          max: largestForce
        } 
      }, () => {
        
        this.createPolar();
      });
      
      this.setState({ isLoading: false });
    }
  }

  /**
   * ---------------------------------------------
   * Create a polar chart
   * @param {Object} config
   * ---------------------------------------------
   */

  getLargestForce = function(array) {
    let maxForce = Math.max(...array.map(revolution => revolution.maxValue));
    //console.log("maxForce: ", maxForce);
    return maxForce;
  }

  createPolar = function() {
    // set some things up
    this.config = this.state.chartConfig;

    // if canvas exists, remove it
    var div = document.getElementById(this.state.chartConfig.divId);
    if(div){
      div.innerHTML = "";
    }

    // create the canvas
    var currentCanvas = this.addCanvas(this.config.divId);

    // draw the target circles
    this.drawTarget(currentCanvas, this.config);
    this.drawTargetLines(currentCanvas, this.config);

    // draw the polar lines
    this.drawPolar(currentCanvas, this.config);

    // draw the AoPF lines
  };

  /**
   * ---------------------------------------------
   * Draw the polar series'
   * @param {Object} canvas
   * @param {Object} config
   * ---------------------------------------------
   */
  drawPolar(canvas, config) {
    let ctx = canvas.getContext('2d');
    const radianValue = 0.01745329252;
    let maxPoint = config.max;
    let multiplier;

    if (canvas.width <= canvas.height) {
      multiplier = canvas.width / 2 / maxPoint;
    } else {
      multiplier = canvas.height / 2 / maxPoint;
    }
    const startpoint = { x: canvas.width / 2, y: canvas.height / 2 };
    for (var i = 0; i < config.series.length; i++) {
      let points = config.series[i].data;
      ctx.strokeStyle = config.series[i].colour;
      ctx.lineWidth = 1;
      ctx.beginPath();
      this.degrees = points[0][0] - 90;
      this.radius = points[0][1] * multiplier;
      ctx.moveTo(
        this.radius * Math.cos((180 - this.degrees) * radianValue) + startpoint.x,
        this.radius * Math.sin((180 - this.degrees) * radianValue) + startpoint.y
      );
      for (var j = 0; j < points.length; j++) {
        this.degrees = points[j][0] - 90;
        this.radius = points[j][1] * multiplier;
        ctx.lineTo(
          this.radius * Math.cos((180 - this.degrees) * radianValue) + startpoint.x,
          this.radius * Math.sin((180 - this.degrees) * radianValue) + startpoint.y
        );
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  /**
   * ---------------------------------------------
   * Draw the target circles in the background
   * @param {Object} canvas
   * @param {Object} config
   * ---------------------------------------------
   */
  drawTarget(canvas, config) {
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    let multiplier;

    if (canvas.width < canvas.height) {
      multiplier = canvas.width / 2 / config.max;
    } else {
      multiplier = canvas.height / 2 / config.max;
    }

    var maxRadius = config.max * multiplier;
    var rings = 6;
    var step = Math.round(maxRadius / rings);

    for (var i = 1; i < rings + 1; i++) {
      context.beginPath();
      context.arc(centerX, centerY, step * i, 0, 2 * Math.PI, false);
      if (i === rings) {
        context.lineWidth = 1.5;
        context.strokeStyle = 'rgba(0,0,0,0.3)';
      } else {
        context.lineWidth = 1;
        context.strokeStyle = 'rgba(0,0,0,0.1)';
      }
      context.stroke();
    }
  }

  /**
   * ---------------------------------------------
   * Draw the target segment lines
   * @param {Object} canvas
   * @param {Object} config
   * ---------------------------------------------
   */
  drawTargetLines(canvas, config) {
    var ctx = canvas.getContext('2d');
    const radianValue = 0.01745329252;
    let multiplier;

    if (canvas.width < canvas.height) {
      multiplier = canvas.width / 2 / config.max;
    } else {
      multiplier = canvas.height / 2 / config.max;
    }
    const radius = config.max * multiplier;
    const lineCount = 8;
    const step = 360 / lineCount;
    const startpoint = { x: canvas.width / 2, y: canvas.height / 2 };

    for (var i = 1; i < lineCount + 1; i++) {
      this.degrees = step * i;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.moveTo(startpoint.x, startpoint.y);
      ctx.lineTo(
        radius * Math.cos(this.degrees * radianValue) + startpoint.x,
        radius * Math.sin(this.degrees * radianValue) + startpoint.y
      );
      ctx.stroke();
    }
  }

  /**
   * ---------------------------------------------
   * Dynamically create and add a canvas to the target div
   * @param {String} divId
   * ---------------------------------------------
   */
  addCanvas(divId) {
    console.log('divId: ' + divId);
    var canvas = document.createElement('canvas');
    var div = document.getElementById(divId);
    div.appendChild(canvas);

    console.log("Div width: ", div.offsetWidth);

    canvas.style.height = div.offsetWidth;
    canvas.height = div.offsetWidth;
    canvas.style.width = div.offsetWidth;
    canvas.width = div.offsetWidth;
    this.state.chartConfig.bg ? canvas.style.background = this.state.chartConfig.bg : canvas.style.background = '#ffffff';

    return canvas;
  }

  render() {
    return <div id="polarChartDiv"></div>;
  }
}

export default withRouter(SessionChartPolarAM);
