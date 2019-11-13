import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { withRouter } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

class SessionChartPolar extends React.Component {
  state = {
    authUser: JSON.parse(localStorage.getItem('authUser')),
    session: {},
    isLoading: true
  };

  componentDidMount = async () => {
    try {
      console.log(JSON.stringify(this.props.data.polarDataFull));

      var series = [
        {
          marker: {
            enabled: false
          },
          visible: true,
          data: this.props.data.polarData
        }
      ];

      this.options = {
        chart: {
          polar: true,
          showAxes: false,
          spacing: [0, 0, 0, 0]
        },
        credits: {
          enabled: false
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            animation: false,
            enableMouseTracking: false,
            marker: {
              enabled: false
            }
          }
        },
        title: {
          text: 'Polar'
        },
        series: this.props.data.polarData,
        xAxis: {
          max: 360,
          min: 0,
          reversed: false,
          tickInterval: 45
        }
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

export default withRouter(SessionChartPolar);
