import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address format')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Password must be 3 characters at minimum')
    .required('Password is required')
});

class Login extends React.Component {
  state = {
    isSubmitting: false
  };

  handleSubmit = async values => {
    try {
      const authUser = await this.getUser(values);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      console.log(JSON.stringify(authUser));
      this.setState({ isSubmitting: false });
      this.props.history.push('/sessions');
    } catch (err) {
      // Error handling
      console.log('error: ' + err);
      this.setState({ isSubmitting: false });
    }
  };

  getUser = async values => {
    try {
      console.log(
        'process.env.REACT_APP_APP_ID: ' + process.env.REACT_APP_APP_ID
      );

      // Build the request
      const axiosOptions = {
        method: 'GET',
        url: process.env.REACT_APP_API_URL + 'login',
        headers: {
          'Content-Type': 'application/json',
          'X-Parse-Application-Id': process.env.REACT_APP_APP_ID,
          'X-Parse-Javascript-Key': process.env.REACT_APP_JS_KEY
        },
        params: {
          username: values.email,
          password: values.password
        }
      };

      // Make the API call
      const { data } = await axios(axiosOptions);

      return data;
    } catch (err) {
      throw new Error('Unable to get a token: ' + err);
    }
  };

  render() {
    return (
      <div className="container">
        <div className="row mb-5">
          <div className="col-lg-12 text-center">
            <h1 className="mt-5">Login Form</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={(values, { setSubmitting }) => {
                this.setState({ isSubmitting: true });
                this.handleSubmit(values);
                setSubmitting(false);
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      className={`form-control ${
                        touched.email && errors.email ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      className={`form-control ${
                        touched.password && errors.password ? 'is-invalid' : ''
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="password"
                      className="invalid-feedback"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={this.state.isSubmitting}
                  >
                    {this.state.isSubmitting ? 'Please wait...' : 'Submit'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
