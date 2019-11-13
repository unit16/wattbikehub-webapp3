import React, { Component } from 'react';
import PrimaryLayout from '../components/PrimaryLayout';
import SessionsList from '../components/SessionsList';

export default class SessionsPage extends Component {
  state = {
    hasErrors: false
  };

  componentDidMount() {}

  render() {
    return (
      <PrimaryLayout>
        <h1>Sessions Page</h1>
        <SessionsList />
      </PrimaryLayout>
    );
  }
}
