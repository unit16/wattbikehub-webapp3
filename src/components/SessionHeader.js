import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { withRouter } from 'react-router-dom';
import TimeFormat from '../components/TimeFormat';
import DistanceFormat from '../components/DistanceFormat';
import PesFormat from '../components/PesFormat';

class SessionHeader extends React.Component {
  state = {
    authUser: JSON.parse(localStorage.getItem('authUser')),
    session: {},
    isLoading: true
  };

  componentDidMount = async () => {

    // console.log("this.props.data: ", JSON.stringify(this.props.data));

    try {
      this.setState({ isLoading: false });
    } catch (err) {
      // Error handling
      console.log('error: ' + err);
    }
  };

  render() {
    return this.state.isLoading ? (
      <div>Loading header stats...</div>
    ) : (
      <div>
        <h3>Header Stats</h3>
        Time: <TimeFormat value={this.props.data.headerData.time} /><br />
        Distance: <DistanceFormat value={this.props.data.headerData.distance} /> <br />
        Cadence Avg: {this.props.data.headerData.cadenceAvg} <br />
        Energy: {this.props.data.headerData.energy} <br />
        Power Max: {this.props.data.headerData.powerMax} <br />
        Power Avg: {this.props.data.headerData.powerAvg} <br />
        PES: <PesFormat value={this.props.data.headerData.pesAvg} /> <br />
        Cadence Max: {this.props.data.headerData.cadenceMax} <br />
        Balance Avg: {this.props.data.headerData.balanceAvg} <br />
      </div>
    );
  }
}

export default withRouter(SessionHeader);
