import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from 'react-router-dom';

export default class SessionsList extends React.Component {

  state = {
    sessionsList: [],
    isLoading: true
  };

  componentDidMount = async () => {
    const SessionsList = await this.getSessions();
    this.setState({ sessionsList: SessionsList.results, isLoading: false });
  };

  getSessions = async values => {
    try {
      const authUser = JSON.parse(localStorage.getItem('authUser'));

      // Build the request
      const axiosOptions = {
        method: 'GET',
        url: process.env.REACT_APP_API_URL + 'classes/RideSession',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': authUser.sessionToken,
          'X-Parse-Application-Id': process.env.REACT_APP_APP_ID,
          'X-Parse-Javascript-Key': process.env.REACT_APP_JS_KEY
        },
        params: {
          where: JSON.stringify({
            user: {
              __type: 'Pointer',
              className: '_User',
              objectId: authUser.objectId
            }
          }),
          include: ['sessionSummary'],
          order: '-startDate',
          limit: 15
        }
      };

      // Make the API call
      const { data } = await axios(axiosOptions);

      return data;
    } catch (err) {
      throw new Error('Response Error: ' + err);
    }
  };

  render() {
    return this.state.isLoading ? (
      <div>Loading...</div>
    ) : (
      <ol>
        {this.state.sessionsList.map(session => (
          <li key={session.objectId}>
            <Link to={`/session/${session.objectId}`}>
              {session.title} - {session.objectId} - {session.sessionSummary.time} - {session.startDate.iso}
            </Link>
          </li>
        ))}
      </ol>
    );
  }
}
