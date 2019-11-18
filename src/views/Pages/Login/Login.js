import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {FormText} from 'reactstrap';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';

class Login extends Component {
  constructor(props) {
      super(props);

      this.state = {
        messageColor: "muted",
        messageText: "Enter user credentials and press Login",
        userName: "kashif",
        password:"DUMMY"
      };
      this.handleLogin = this.handleLogin.bind(this);
      this.handleUserNameChange = this.handleUserNameChange.bind(this);
      this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUserNameChange(event) {
      this.setState({userName: event.target.value.trim()});
  }
  handlePasswordChange(event) {
      this.setState({password: event.target.value});
  }


  handleLogin(event) {
    event.preventDefault();
      this.setState({messageColor: "muted", messageText: ""}); 
    if (this.state.userName.trim().length === 0) {
      this.setState({messageColor: "danger", messageText: "please enter a user id"}); 
    } else if (this.state.password.length === 0) {
      this.setState({messageColor: "danger", messageText: "please enter a password"}); 
    } else {
      this.setState({messageColor: "warning", messageText: "Authenticating ..."}); 

      fetch(API_PREFIX + '/imd-farm-management/user/login', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "userId": this.state.userName,
            "loginToken": this.state.password,
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({messageText: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({messageText: "Authenticated(" + responseJson.authToken + ")", messageColor: "success"});
           this.props.history.push('/dashboard');
        }
      })
      .catch(error => { 
        this.setState({messageText: error.toString(), messageColor: "danger"})
      });
    }
  }

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="10">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" placeholder="Username" autoComplete="username" onChange={this.handleUserNameChange} value={this.state.userName}/>
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" placeholder="Password" autoComplete="current-password" onChange={this.handlePasswordChange} value={this.state.password}/>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                            <Button color="primary" className="px-4" onClick={this.handleLogin}>Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                        &nbsp;&nbsp;
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                        <FormText color={this.state.messageColor}>&nbsp;{this.state.messageText}</FormText>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '80%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>At IMDairies we use our home grown Farm Solutions software to manage our herd. The existing solutions in the market are either 
                      butil for large commercial dairies or are overly simplistic to be of any real use to small and medium dairy farms. <i>IMDairies Farm Management Solution</i> is our attempt
                      to provide small and medium dairy farm owners with a simple to use managed software to help them manage their herd effectively. The maiin focus of this software
                      is herd management. As of now the software is in pilot use and is made freely available to a few pilot users. If you want to be included in the pilot user group press the button below and one of our representatives will
                      get in touch with you. 
                      </p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
