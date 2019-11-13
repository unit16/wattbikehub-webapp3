import React from 'react';
import Header from './Header';
import { withRouter } from 'react-router-dom';

const layoutStyle = {
  // margin: 20,
  // padding: 20,
  // border: '1px solid #DDD'
};
const contentContainerStyle = {
  // margin: 20,
  padding: 20,
  // border: '1px solid #DDD'
};

const PrimaryLayout = props => (
  <div style={layoutStyle}>
    <Header />
    <div style={contentContainerStyle}>
      { props.children }
    </div>
  </div>
);

export default withRouter(PrimaryLayout);
