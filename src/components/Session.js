import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

export default class Session extends React.Component {
  state = {
    authUser: JSON.parse(localStorage.getItem('authUser')),
    session: {},
    isLoading: true
  };

  componentDidMount = async () => {
    try {
      // const SessionsList = await this.getSessions(props);
      console.log('session to search for: ' + this.props.id);
      const session = await this.getSession(this.props.id);
      this.setState({ session: session, isLoading: false });
      const file = await this.getFile(this.state.session.sessionData.wbs.name);
      console.log(JSON.stringify(file));
    } catch (err) {
      // Error handling
      console.log('error: ' + err);
    }
  };

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
          include: 'sessionSummary'
        }
      };

      // Make the API call
      const { data } = await axios(axiosOptions);
      return data;
    } catch (err) {
      throw new Error('Response Error: ' + err);
    }
  };

  getFile = async file => {
    try {
      console.log('file: ' + file);

      // Build the request
      const axiosOptions = {
        method: 'GET',
        url: process.env.REACT_APP_API_URL + 'files/' + file
      };

      // Make the API call
      const { data } = await axios(axiosOptions);
      return data;
    } catch (err) {
      throw new Error('Response Error: ' + err);
    }
  };

  render() {
    return this.state.isLoading ? <div>Loading...</div> : <p>Test</p>;
  }
}
