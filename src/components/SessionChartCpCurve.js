import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { withRouter } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class SessionChartCpCurve extends React.Component {
  state = {
    authUser: JSON.parse(localStorage.getItem('authUser')),
    session: {},
    isLoading: true
  };

  componentDidMount = async () => {

    try {

      let plotSeries = [];
      let counter = 0;

      let that = this;
      Object.keys(this.props.data.cpResults).forEach(function(key) {
        plotSeries.push({
          x: counter,
          y: parseInt(that.props.data.cpResults[key].avg)
        });
        counter++;
      });

      this.options = {
        chart: {
          type: 'spline',
          zoomType: ''
        },
    
        title: {
          text: 'CP Curve'
        },
        
        xAxis: {
          categories: this.props.data.cpIntervals,
          labels: {
            formatter: function () {
              var label = this.axis.defaultLabelFormatter.call(this);
    
              if (label > 60) {
                return (label / 60) + ':00';
              }else{
                return label + 's'
              }

            }
          }
        },
        series: [{
          data: plotSeries
        }]
      };

      this.setState({ isLoading: false });
    } catch (err) {
      // Error handling
      console.log('error: ' + err);
    }
  };

  render() {
    return this.state.isLoading ? (
      <div>Loading main chart...</div>
    ) : (
      <div>
        <div>
          <HighchartsReact highcharts={Highcharts} options={this.options} />
        </div>
      </div>
    );
  }
}

export default withRouter(SessionChartCpCurve);
