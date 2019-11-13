import React, { Component } from 'react';
import PrimaryLayout from '../components/PrimaryLayout';
import axios from 'axios';
import SessionHeader from '../components/SessionHeader';
import SessionChartMain from '../components/SessionChartMain';
import SessionChartPolarAM from '../components/SessionChartPolarAM';
import SessionChartCpCurve from '../components/SessionChartCpCurve';
import Loading from '../components/Loading';
import ProcessData from '../utils/ProcessData';

export default class SessionPage extends Component {

  state = {
    authUser: JSON.parse(localStorage.getItem('authUser')),
    session: {}, // holds the Hub api response for the session GET
    isLoading: true, // used to determin which components to show
    loadingMessage: "Loading data...", // loading message, is updated during page load
    viewerIsOwner: false, // is the person viewing also known to be the owner of the session
    file: null, // String - holds the content of the wbs file
    processedData: null, // Object - holds the chart friendly data after processing
    currentData: null, // Object - holds the croped set of sampled down data after zooming
    // headerData: { // Holds the current state of the top level data, used because these change when data is zoomed
    //   distance: null,
    //   pes: null,
    //   speed: null,
    //   energy: null,
    //   powerMax: null,
    //   powerAvg: null,
    //   hrAvg: null,
    //   hrMax: null,
    //   cadenceAvg: null,
    //   cadenceMax: null,
    // }, 
    cpIntervals: [5, 10, 30, 60, 120, 240, 300, 600, 1200, 3600], // seconds, contiguous periods to calculate CP for
    currentRevolution: { // used with hover callback to hold the data for the current revolution
      index: null,
    },
    currentZoom:{ // used to hold both the time and array index of the zoom extents
      minSeconds: null,
      maxSeconds: null,
      minIndex: null, 
      maxIndex: null
    }
    
  };

  ////////////////////////////////////////////////////////////////////////
  // Get and prepare data
  ////////////////////////////////////////////////////////////////////////

  componentDidMount = async () => {

    try {

      // Get Session Meta data and Summary
      const session = await this.getSession(this.props.match.params.id);
      this.setState({ session: session });

      // Get session file
      const file = await this.getFile(this.state.session.sessionData.wbs.name);
      this.setState({ file: file });

      // Process chart data
      this.setState({ loadingMessage: "Crunching the numbers..." });
      let processOptions = {
        file: file,
        cpIntervals: this.state.cpIntervals,
        minIndex: this.state.currentZoom.minIndex, 
        maxIndex: this.state.currentZoom.maxIndex
      }
      const processedData = await ProcessData(processOptions);
      console.log(processedData.headerData);
      // await this.wait(2000); // test a delay in processing file
      this.setState({ processedData: processedData, currentData: processedData });

      // Is viewer also the owner
      if (this.state.session.user.objectId === this.state.authUser.objectId) {
        this.setState({ viewerIsOwner: true });
      }

      this.setState({ isLoading: false });

    } catch (err) {
      console.log('error: ' + err);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  // Chart Callbacks
  ////////////////////////////////////////////////////////////////////////

  // Callback to handle master chart zoom
  handleChangeZoom = value => {
    let minIndex = this.getIndexFromSeconds(value.min);
    let maxIndex = this.getIndexFromSeconds(value.max);
    this.setState({currentZoom: {minSeconds: value.min, maxSeconds: value.max, minIndex: minIndex, maxIndex: maxIndex}});
    this.setCurrentDataRange();
  }

  // Callback to handle master chart hover
  handleChangeToolTip = value => {
    let index = this.getIndexFromSeconds(value);

    let revolutionData = {
      index: index,
      revolution: this.state.processedData.revolutions[index],
      polar: this.state.processedData.polarDataFull[index]
    }
    // show single polar line on hover
    // this.setState({currentData: {polarDataFull: [this.state.processedData.polarDataFull[index]]}});

    console.log("Hover revolutionData: ", revolutionData);
  }

  ////////////////////////////////////////////////////////////////////////
  // Return the index of the master chart point based on the xaxis time value of the point
  // - Note: in case of zooming, highcharts supplies an x axis value between points, I am getting 
  // - the index above the value returned in these cases, hence '>='
  ////////////////////////////////////////////////////////////////////////
  getIndexFromSeconds = seconds => {
    let index = this.state.processedData.revolutions.findIndex(x => x.cumulative >= seconds);
    return index;
  }

  ////////////////////////////////////////////////////////////////////////
  // Crop down the full data range to the zoom level of the master chart
  ////////////////////////////////////////////////////////////////////////
  setCurrentDataRange = async () => {
    let indexStart = this.state.currentZoom.minIndex;
    let indexEnd = this.state.currentZoom.maxIndex;
    
    // Get subset of polar revolution
    // let polarSubset = this.state.processedData.polarDataFull.slice(indexStart, indexEnd);

    // Update header details

    // Set new data to state
    // this.setState({currentData:{ polarDataFull: polarSubset }});

    this.setState({ loadingMessage: "Crunching the numbers..." });
    let processOptions = {
      file: this.state.file,
      cpIntervals: this.state.cpIntervals,
      minIndex: this.state.currentZoom.minIndex, 
      maxIndex: this.state.currentZoom.maxIndex
    }
    const processedData = await ProcessData(processOptions);
    console.log(processedData.headerData);
    // await this.wait(2000); // test a delay in processing file
    this.setState({ processedData: processedData, currentData: processedData });

  }

  ////////////////////////////////////////////////////////////////////////
  // Fetch session and user details from Hub API
  ////////////////////////////////////////////////////////////////////////
  getSession = async id => {
    try {
      // Build the request
      const axiosOptions = {
        method: 'GET',
        url: process.env.REACT_APP_API_URL + 'classes/RideSession/' + id,
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': this.state.authUser.sessionToken,
          'X-Parse-Application-Id': process.env.REACT_APP_APP_ID,
          'X-Parse-Javascript-Key': process.env.REACT_APP_JS_KEY
        },
        params: {
          include: ['user', 'sessionSummary', 'userPerformanceState', 'user.preferences', 'training.workout']
        }
      };

      // Make the API call
      const { data } = await axios(axiosOptions);
      return data;
    } catch (err) {
      throw new Error('Response Error: ' + err);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  // Get the full wbs file for this session from Hub API
  ////////////////////////////////////////////////////////////////////////
  getFile = async file => {
    try {
      // Build the request
      const axiosOptions = {
        method: 'GET',
        url: process.env.REACT_APP_API_URL + 'files/' + file
      };

      // Make the API call
      const { data } = await axios(axiosOptions);
      return data;
    } catch (err) {
      throw new Error('File Error: ' + err);
    }
  };

  ////////////////////////////////////////////////////////////////////////
  // Misc functions
  ////////////////////////////////////////////////////////////////////////

  // Used for testing a slow connection, can be removed when not needed
  wait = ms => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Done waiting");
        resolve(ms)
      }, ms )
    })
  }

  ////////////////////////////////////////////////////////////////////////
  // Style and render our output
  ////////////////////////////////////////////////////////////////////////
  render() {
    // Components needed
    // - SessionHeader
    // - SessionData
    // - SessionChartMain
    // - SessionChartPolarChart
    // - SessionChartCriticalPower
    // - SessionChartTimeInZone
    // - SessionChartLegBalance
    // - - - -
    // - New: Laps Breakdown
    // - New: Compilance Score
    // - New: Workout overlay
    // - New: Climb overlay

    // 
    const polarStyle = {
      width: "50%"
    }

    return this.state.isLoading ? (
      <PrimaryLayout>
        <Loading message={this.state.loadingMessage} />
      </PrimaryLayout>
    ) : (
      <PrimaryLayout>
        <SessionHeader data={this.state.currentData} />
        <SessionChartMain data={this.state.processedData} handleChangeZoom={this.handleChangeZoom}  handleChangeToolTip={this.handleChangeToolTip} />
        <div style={polarStyle}>
          <SessionChartPolarAM data={this.state.currentData} bg="#ffffff" />
        </div>
        <SessionChartCpCurve data={this.state.currentData} />
      </PrimaryLayout>
    );
  }
}
