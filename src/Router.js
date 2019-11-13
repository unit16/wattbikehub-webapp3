import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SessionsPage from './pages/SessionsPage';
import SessionPage from './pages/SessionPage';

const authUser = JSON.parse(localStorage.getItem('authUser'));

const Router = props => (
  <Switch>
    <Route exact path="/" component={HomePage} />
    <Route exact path="/about" component={AboutPage} />
    <Route exact path="/login" component={LoginPage} />
    <Route exact path="/signup" component={SignUpPage} />
    <ProtectedRoute exact path="/sessions" component={SessionsPage} />
    <ProtectedRoute path="/session/:id" component={SessionPage} />
  </Switch>
);

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authUser ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: '/login', state: { from: props.location } }}
        />
      )
    }
  />
);

export default Router;
