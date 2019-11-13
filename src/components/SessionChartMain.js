import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { withRouter } from 'react-router-dom';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class SessionChartMain extends React.Component {
  state = {
    authUser: JSON.parse(localStorage.getItem('authUser')),
    session: {},
    isLoading: true,
    colors: ['#3f93f4', '#ed1c24', '#ffa505']
  };

  componentDidMount = async () => {

    let that = this;

    try {
      var series = [
        {
          color: this.state.colors[0],
          name: 'Power',
          marker: {
            enabled: false,
            states: {
              hover: {
                radius: 4
              }
            },
            symbol: 'circle'
          },
          visible: true,
          data: this.props.data.powerData
        },
        {
          color: this.state.colors[1],
          name: 'HR',
          marker: {
            enabled: false,
            states: {
              hover: {
                radius: 4
              }
            },
            symbol: 'circle'
          },
          visible: true,
          data: this.props.data.heartrateData
        },
        {
          color: this.state.colors[2],
          name: 'Cadence',
          marker: {
            enabled: false,
            states: {
              hover: {
                radius: 4
              }
            },
            symbol: 'circle'
          },
          visible: true,
          data: this.props.data.cadenceData
        }
      ];

      this.options = {
        chart: {
          type: 'line',
          zoomType: 'x',
          animation: false
        },
        title: {
          text: 'My chart'
        },
        tooltip: {
          pointFormatter: function() {
            handleToolTip(this.x, that.props);
            return '<b>Line series:</b> ' + this.y;
          }
        },
        series: series,
        plotOptions: {
          series: {
            animation: false
          },
          line: {
            lineWidth: 1,
          },
          spline: {
            dataGrouping: {
              enabled: true,
              forced: true,
              smoothed: true,
              units: [[
                'second', [1]
              ]]
            },
            lineWidth: 1,
          }
        },
        title: {
          text: null
        },
        tooltip: {
          borderColor: '#999',
          shared: true
        },
        yAxis: {title: "" },
        xAxis: {
          crosshair: true,
          labels: {
            formatter: function () {
              let minutes = Math.floor(this.value / 60);
              let seconds = this.value - minutes * 60;
              return minutes + ':' + seconds;
            }
          },
          plotLines: [],
          events: {
            afterSetExtremes (e) {
              handleZoom(e,that.props)
            }
          }
        },
        // xAxis: {
        //   events: {
        //     afterSetExtremes (e) {
        //       handleZoom(e,that.props)
        //     }
        //   }
        // }
      };

      function handleZoom ({ min, max }, props) {
        props.handleChangeZoom({ min, max });
      }

      function handleToolTip (value, props) {
        props.handleChangeToolTip(value);
      }

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
          <HighchartsReact highcharts={Highcharts} options={this.options} onChange={this.props.onChangeValue}/>
        </div>
      </div>
    );
  }
}

export default withRouter(SessionChartMain);
