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
  Row,
  Label,
  Nav, 
  NavItem, 
  NavLink   
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import classnames from 'classnames';
import { Link } from 'react-router-dom';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class IMDAddLifecycleEventCode extends Component {
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
      eventcode : "" ,
      shortdescription: "",
      longdescription: "",
      activeIndicator : "N" ,
      messageColor: "muted",
      eventAdditionalMessage: "Specify desired values and press Add button"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);    
  }

  // componentDidMount() {
  //   const parsed = queryString.parse(this.props.location.search);
  //   this.setState({eventcode: parsed.eventCode, invalidAccess: (parsed.eventCode ? false : true)});

  //   this.setState({items: [], isLoaded: false, eventAdditionalMessage: "Processing ..."}); 
  //   fetch(API_PREFIX + '/imd-farm-management/lv-lifecycle-event/search', {
  //       method: "POST",
  //       headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         "eventCode": parsed.eventCode
  //     })
  //   })
  //   .then(response => response.json())
  //   .then(responseJson => {
  //     if (responseJson.error) {
  //        this.setState({items: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
  //     }
  //     else {
  //        this.setState({items: responseJson, shortdescription: responseJson[0].eventShortDescription , longdescription: responseJson[0].eventLongDescription, isActive: responseJson[0].isActive,  isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? "Edit the desired values and press Search button" : "We expected to receive only one record matching the event code '" + parsed.eventCode + "' but we received " + responseJson.length), messageColor: "muted"});
  //         if (responseJson.length > 1)
  //           this.setState({messageColor: "danger"});
  //        if (responseJson[0].isActive)
  //         document.getElementById("active").checked = true;
  //        else 
  //         document.getElementById("active").checked = false;
  //     }
  //   })
  //   .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
  // }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
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

  handleAdd(event) {
    event.preventDefault();
    let eventCd = document.getElementById("eventcode").value;
    let shortDescr = document.getElementById("shortdescription").value;
    let longDescr = document.getElementById("longdescription").value;
    let active = (document.getElementById("active").checked ? "Y" : "N");

    if (eventCd.length === 0) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter a valid Event Code"});
      document.getElementById("eventcode").focus();
    } else if (shortDescr.length === 0) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter a valid Short Description"});
      document.getElementById("shortdescription").focus();
    } else if (longDescr.length === 0) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter a valid Long Description"});
      document.getElementById("longdescription").focus();
    } else {
      this.setState({eventcode: eventCd, 
        shortdescription: shortDescr, 
        longdescription:  longDescr, 
        activeIndicator:  active,
        eventAdditionalMessage: "Processing ..."
      });

      fetch(API_PREFIX + '/imd-farm-management/lv-lifecycle-event/add', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "eventCode": this.state.eventcode,
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
    var { eventAdditionalMessage, messageColor} = this.state;
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
                        className={classnames({ active: true })}
                        onClick={this.handleTabClick("add-tab")}
                      >
                         <i className="fa fa-plus"></i><strong>{' '}Add</strong>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <Card>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Code</Label>
                          <Col sm="8">
                            <Input id="eventcode" type="text" maxLength="10" value={this.state.eventcode} onChange={this.handleChange} placeholder="Event Code"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Active</Label>
                          <Col sm="8">
                            <AppSwitch id="active" className="mx-1" color="success" label checked />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Short Description</Label>
                          <Col sm="8">
                              <Input id="shortdescription" type="text" maxLength="75" value={this.state.shortdescription} onChange={this.handleChange} placeholder="Short Description"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="4">
                            <Label htmlFor="textarea-input">Long Description</Label>
                          </Col>
                          <Col md="8">
                            <Input id="longdescription" type="textarea" name="longdescription" rows="5" value={this.state.longdescription} onChange={this.handleChange} placeholder="Long Description"  />
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleAdd}><i className="fa fa-plus"></i>{' '}Add</Button>
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

export default IMDAddLifecycleEventCode;
