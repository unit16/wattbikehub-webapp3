import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { withRouter } from 'react-router-dom';
import TimeFormat from '../components/TimeFormat';
import DistanceFormat from '../components/DistanceFormat';
import PesFormat from '../components/PesFormat';
import WattbikeModel from '../components/WattbikeModel';

class SessionHeader extends React.Component {
  state = {
    authUser: JSON.parse(localStorage.getItem('authUser')),
    session: {},
    isLoading: true
  };

  componentDidMount = async () => {

    console.log("this.props.data: ", JSON.stringify(this.props.data));

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
        Title: {this.props.data.session.title} <br />
        Time: <TimeFormat value={this.props.data.headerData.time} /><br />
        Distance: <DistanceFormat value={this.props.data.headerData.distance} /> <br />
        Cadence Avg: {this.props.data.session.sessionSummary.cadenceAvg} <br />
        Energy: {this.props.data.session.sessionSummary.energy} <br />
        Power Max: {this.props.data.session.sessionSummary.powerMax} <br />
        Power Avg: {this.props.data.session.sessionSummary.powerAvg} <br />
        PES: <PesFormat value={this.props.data.session.sessionSummary.pesCombinedCoefficient} /> <br />
        Cadence Max: {this.props.data.session.sessionSummary.cadenceMax} <br />
        Balance Avg: {this.props.data.session.sessionSummary.balanceAvg} <br />
        Laps: {this.props.data.session.laps.length + 1} <br />
        Training: { this.props.data.session.training ? this.props.data.session.training.workout.title : 'Not Workout'} <br />
        --------- <br />
        Serial Number: {this.props.data.session.wattbikeDevice.serialNumber} <br />
        Model: <WattbikeModel value={this.props.data.session.wattbikeDevice.serialNumber} /> <br />
        Firmware Version: {this.props.data.session.wattbikeDevice.firmwareVersion} <br />       
        File: {this.props.data.session.sessionData.wbs.name} <br />     
      </div>
    );
  }
}

export default withRouter(SessionHeader);
