import React from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

class Logout extends React.Component {
  state = {};

  handleClick = () => {
    try {
      console.log('Loged out');
      localStorage.removeItem('authUser');
      this.props.history.push('/login');
    } catch (err) {
      // Error handling
      console.log('error: ' + err);
      this.setState({ isSubmitting: false });
    }
  };

  render() {
    var buttonStyle = {
      margin: '10px 10px 10px 0'
    };

    return (
      <button
        className="btn btn-default"
        style={buttonStyle}
        onClick={this.handleClick}
      >
        Logout
      </button>
    );
  }
}

export default withRouter(Logout);
