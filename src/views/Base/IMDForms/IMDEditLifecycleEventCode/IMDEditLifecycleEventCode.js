import React, { Component } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Fade,
  Form,
  FormGroup,
  FormText,
  Input,
  // InputGroup,
  Row,
  Label,
  Nav, 
  NavItem, 
  NavLink   
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import queryString from 'query-string';
import { Link } from 'react-router-dom';



class IMDEditLifecycleEventCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidAccess: false,
      collapse: true,
      warning: false,
      fadeIn: true,
      items: [],
      isLoaded: false,
      timeout: 300,
      isActive: false,
      eventcode : "" ,
      shortdescription: "",
      longdescription: "",
      activeIndicator : "N" ,
      messageColor: "muted",
      eventAdditionalMessage: "Edit desired values and press Update"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);    
  }

  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({eventcode: parsed.eventCode, invalidAccess: (parsed.eventCode ? false : true)});

    this.setState({items: [], isLoaded: false, eventAdditionalMessage: "Processing ..."}); 
    fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "eventCode": parsed.eventCode
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({items: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({items: responseJson, shortdescription: responseJson[0].eventShortDescription , longdescription: responseJson[0].eventLongDescription, isActive: responseJson[0].isActive,  isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? "Edit the desired values and press Update button" : "We expected to receive only one record matching the event code '" + parsed.eventCode + "' but we received " + responseJson.length), messageColor: "muted"});
          if (responseJson.length > 1)
            this.setState({messageColor: "danger"});
         if (responseJson[0].isActive)
          document.getElementById("active").checked = true;
         else 
          document.getElementById("active").checked = false;
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
  }

  handleChange(event) {
    if (event.target.id === "eventcode")
      this.setState({eventcode: event.target.value});
    if (event.target.id === "shortdescription")
      this.setState({shortdescription: event.target.value});
    if (event.target.id === "longdescription")
      this.setState({longdescription: event.target.value});
    if (event.target.id === "active")
      this.setState({activeIndicator: (event.target.checked ? "Y": "N")});
  }

  handleUpdate(event) {
    event.preventDefault();
    let eventCd = document.getElementById("eventcode").value;
    let shortDescr = document.getElementById("shortdescription").value;
    let longDescr = document.getElementById("longdescription").value;
    let active = (document.getElementById("active").checked ? "Y" : "N");

    if (eventCd.length === 0) {
      alert("Event Code should not have been empty");
      this.setState({invalidAccess: true});
    } else if (shortDescr.length === 0) {
      alert("Short Description can't be empty");
      document.getElementById("shortdescription").focus();
    } else if (longDescr.length === 0) {
      alert("Long Description can't be empty");
      document.getElementById("longdescription").focus();
    } else {
      this.setState({eventcode: eventCd, 
        shortdescription: shortDescr, 
        longdescription:  longDescr, 
        activeIndicator:  active,
        eventAdditionalMessage: "Processing ..."
      });

      fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event/update', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "eventCode": eventCd,
            "eventShortDescription": shortDescr,
            "eventLongDescription": longDescr,
            "activeIndicator": active
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    }
  }

  render() {
    var { invalidAccess, eventAdditionalMessage, messageColor} = this.state;
    if (invalidAccess)
      return (<Redirect to='/base/forms'  />);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="8">
                 <Nav tabs>
                    <NavItem>
                      <NavLink id="search-tab"
                        className={classnames({ active: false })}
                        onClick={this.handleTabClick("search-tab")}
                      >
                         <Link to={'/base/forms'}><i className="fa fa-search"></i>{' '}</Link><strong>Search</strong>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="add-tab"
                        className={classnames({ active: false })}
                        onClick={this.handleTabClick("add-tab")}
                      >
                         <Link to={'/base/IMDAddLifecycleEventCode'}><i className="fa fa-plus"></i>{' '}</Link><strong>Add</strong>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="update-tab"
                        className={classnames({ active: true })}
                        onClick={this.handleTabClick("update-tab")}
                      >
                         <i className="fa fa-pencil"></i><strong>{' '}Update</strong>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <Card>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Code</Label>
                          <Col sm="8">
                              <Input id="eventcode" type="text" maxLength="10" value={this.state.eventcode}  disabled />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Active</Label>
                          <Col sm="8">
                            <AppSwitch id="active" className="mx-1" color="success" label checked={this.state.isActive} onChange={this.handleChange} />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Short Description</Label>
                          <Col sm="8">
                              <Input id="shortdescription" type="text" maxLength="75" value={this.state.shortdescription} onChange={this.handleChange} />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="4">
                            <Label htmlFor="textarea-input">Long Description</Label>
                          </Col>
                          <Col md="8">
                            <Input id="longdescription" type="textarea" name="longdescription" rows="5" value={this.state.longdescription} onChange={this.handleChange} />
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleUpdate}><i className="fa fa-edit"></i>&nbsp;Update</Button>
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

export default IMDEditLifecycleEventCode;
