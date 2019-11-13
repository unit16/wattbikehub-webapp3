import React, { Component } from 'react';
import PrimaryLayout from '../components/PrimaryLayout';
import Logout from '../components/Logout';

export default class About extends Component {
  state = {
    hasErrors: false,
    planets: []
  };

  componentDidMount() {}

  render() {
    const authUser = JSON.parse(localStorage.getItem("authUser"));

    return (
      <PrimaryLayout>
        <h1>Me</h1>
        <p>{ authUser.sessionToken }</p>
        <p>{ authUser.vanityName }</p>
        <p>{ authUser.birthDate.iso }</p>
        <Logout />
      </PrimaryLayout>
    );
  }
}
