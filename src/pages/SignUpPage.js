import React, { Component } from 'react';
import PrimaryLayout from '../components/PrimaryLayout';
import SignUp from '../components/SignUp';

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
        <SignUp />
      </PrimaryLayout>
    );
  }
}
