import React, { Component } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Fade,
  Form,
  FormGroup,
  FormText,
  Input,
  Row,
  Label,
  Nav, 
  NavItem, 
  NavLink   
} from 'reactstrap';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class UpdateMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      warning: false,
      fadeIn: true,
      items: [],
      isLoaded: false,
      timeout: 300,
      isActive: false,
      messageCD: "",
      languageCD: "",
      languageValue: "",
      messageText: "",
      authenticated: true,
      invalidAccess: false,
      messageColor: "muted",
      isRecordDirty: false,
      message: "Specify edit message text and press Update button"
    };
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);    
  }


  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    let invalidAccess = false;
    if (!parsed.messageCD)
      invalidAccess = true;
    if (!parsed.languageCD)
      invalidAccess = true;
    this.setState({invalidAccess: invalidAccess,items: [], isLoaded: false, message: "Processing ..."}); 

    //alert(parsed.languageCD + "-" + parsed.messageCD);

    fetch(API_PREFIX + '/imd-farm-management/messagecatalog/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "languageCD": parsed.languageCD,
          "messageCD": parsed.messageCD,
          "loginToken": (new Cookies()).get('authToken')
      })
    })
    .then(response => {
      if (response.status === 401)
        this.setState({authenticated : false});
      return response.json();
    })
    .then(data => {
      if (data.error) {
         this.setState({languageCD: "", messageCD: "",  messageText:data[0].messageText, isLoaded: true, message: data.message, messageColor: "danger"});
      }
      else {
         this.setState({languageCD: data[0].languageCD,messageCD: data[0].messageCD, messageText:data[0].messageText, isLoaded: true, message: (data.length === 1 ? data.length + " matching record found" : data.length + " matching records found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));


   }

  handleTabClick(targetID) {
  }

  handleTextChange(event) {
    if (event.target.value === this.state.messageText)
      ;
    else {
      this.setState({messageText: event.target.value, isRecordDirty: true});
    }
  }

  handleUpdate(event) {
    event.preventDefault();
    let messageCD = this.state.messageCD; 
    let languageCD = this.state.languageCD;
    let messageText = this.state.messageText;
//    alert("[" + languageCD + "] [" + messageCD + "] [" + messageText + "]");

    if (languageCD.length === 0) {
      this.setState({messageColor: "danger", message: "Please select a valid Language Code"});
      document.getElementById("languageCD").focus();
    } else if (messageCD.length === 0) {
      this.setState({messageColor: "danger", message: "Please enter a valid Message Code"});
      document.getElementById("messageCD").focus();
    } else if (messageText.length === 0) {
      this.setState({messageColor: "danger", message: "Please enter Message Text"});
      document.getElementById("messageText").focus();
    } else {
      this.setState({messageCD: messageCD,
        languageCD: languageCD, messageText:  messageText,messageColor: "muted",
        message: "Processing ..."});

      fetch(API_PREFIX + '/imd-farm-management/messagecatalog/update', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "messageCD": messageCD,
            "languageCD": languageCD,
            "messageText": messageText,
            "loginToken": (new Cookies()).get('authToken')
        })
      })
      .then(response => {
        if (response.status === 401)
          this.setState({authenticated : false});
        return response.json();
      })
      .then(data => {
        if (data.error) {
           this.setState({isLoaded: true, message: data.message, messageColor: "danger"});
        }
        else {
           this.setState({isLoaded: true, message: data.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
    }
  }

  render() {
    var { authenticated, invalidAccess, message, messageColor} = this.state;
    if (!authenticated || invalidAccess)
      return (<Redirect to='/login'  />);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="8">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i><strong>Lookup Maintenance</strong>
                  </CardHeader>
                  <CardBody>
                    <Nav tabs>
                      <NavItem>
                        <NavLink id="search-tab"
                          className={classnames({ active: false })}
                          onClick={this.handleTabClick("search-tab")}>
                           <Link to={'/admin/messagecatalog/search'}><i className="fa fa-search"></i>{' '}</Link><strong>Search</strong>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink id="update-tab"
                          className={classnames({ active: true })}
                          onClick={this.handleTabClick("update-tab")}>
                           <i className="fa fa-pencil"></i>{' '}<strong>Update</strong>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink id="add-tab"
                          className={classnames({ active: false })}
                          onClick={this.handleTabClick("add-tab")}>
                           <Link to={'/admin/messagecatalog/add'}><i className="fa fa-plus"></i>{' '}</Link><strong>Add</strong>
                        </NavLink>
                      </NavItem>
                    </Nav>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
                          </Col>
                        </FormGroup>                      
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Language Code</Label>
                          <Col sm="8">{this.state.languageCD}</Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Message Code</Label>
                          <Col sm="8">{this.state.messageCD}</Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Message Text</Label>
                          <Col sm="8">
                              <Input id="messageText" type="textarea" maxLength="255" value={this.state.messageText} onChange={this.handleTextChange} placeholder="Message Text"  />
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{message}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" disabled={!this.state.isRecordDirty} onClick={this.handleUpdate}><i className="fa fa-plus"></i>{' '}Update</Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </Fade>
          </Col>
        </Row>
      </div>
    );
  }
}

export default UpdateMessage;
