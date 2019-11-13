import React from 'react';
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, NavItem } from "react-bootstrap";
// import logo from '/assets/images/logo.png'; 

const linkStyle = {
  "marginRight": 15,
  "color": "#ffffff",
  "cursor": "pointer"
};

const Header = () => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    {/* <img style={{width: 50}} src={process.env.PUBLIC_URL + '/assets/images/Wattbike_icon_512x512.png'} alt="Logo" /> */}
    <LinkContainer to="/" style={linkStyle}>
      <Navbar.Brand href="#home">Wattbike Hub</Navbar.Brand>
    </LinkContainer>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
        <LinkContainer to="/" style={linkStyle}>
          <NavItem>Home</NavItem>
        </LinkContainer>
        <LinkContainer to="/sessions" style={linkStyle}>
          <NavItem>My Activity</NavItem>
        </LinkContainer>
        <LinkContainer to="/about" style={linkStyle}>
          <NavItem>Me</NavItem>
        </LinkContainer>
      </Nav>
      <Nav>
        <LinkContainer to="/about" style={linkStyle}>
          <NavItem>About</NavItem>
        </LinkContainer>
        <LinkContainer to="/signup" style={linkStyle}>
          <NavItem>Sign Up</NavItem>
        </LinkContainer>
        <LinkContainer to="/login" style={linkStyle}>
          <NavItem>Log In</NavItem>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
