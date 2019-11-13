import React, { Component } from 'react';
import PrimaryLayout from '../components/PrimaryLayout';
import Login from '../components/Login';

export default class LoginPage extends Component {
  state = {
    hasErrors: false,
    planets: []
  };

  componentDidMount() {}

  render() {
    return (
      <PrimaryLayout>
        <h1>Login Page</h1>
        <Login />
      </PrimaryLayout>
    );
  }
}
