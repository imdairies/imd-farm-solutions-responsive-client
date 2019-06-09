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
  // InputGroup,
  Row,
  Label,
  Nav, 
  NavItem, 
  NavLink   
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import classnames from 'classnames';
import queryString from 'query-string';
import { Link } from 'react-router-dom';



class UpdateLookup extends Component {
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
      categoryCode: "",
      lookupValueCode : "" ,
      shortdescription: "",
      longdescription: "",
      activeIndicator : "N" ,
      additionalField1: "",
      additionalField2: "",
      additionalField3: "",
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
    this.setState({categoryCode: parsed.categoryCode, lookupValueCode: parsed.lookupValueCode, invalidAccess: (parsed.eventCode ? false : true)});
    this.setState({items: [], isLoaded: false, eventAdditionalMessage: "Processing ..."}); 
    fetch('http://localhost:8080/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": parsed.categoryCode,
          "lookupValueCode": parsed.lookupValueCode
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({items: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({items: responseJson, shortdescription: responseJson[0].shortDescription, longdescription: responseJson[0].longDescription, additionalField1: responseJson[0].additionalField1, additionalField2: responseJson[0].additionalField2, additionalField3: responseJson[0].additionalField3, isActive: responseJson[0].isActive,  isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? "Edit the desired values and press Update button" : "We expected to receive only one record matching the event code '" + parsed.eventCode + "' but we received " + responseJson.length), messageColor: "muted"});
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
    if (event.target.id === "categoryCode")
      this.setState({categoryCode: event.target.value});
    if (event.target.id === "lookupValueCode")
      this.setState({lookupValueCode: event.target.value});
    if (event.target.id === "shortdescription")
      this.setState({shortdescription: event.target.value});
    if (event.target.id === "longdescription")
      this.setState({longdescription: event.target.value});
    if (event.target.id === "active")
      this.setState({activeIndicator: (event.target.checked ? "Y": "N")});
    if (event.target.id === "additionalField1")
      this.setState({additionalField1: event.target.value});
    if (event.target.id === "additionalField2")
      this.setState({additionalField2: event.target.value});
    if (event.target.id === "additionalField3")
      this.setState({additionalField3: event.target.value});
  }

  handleUpdate(event) {
    event.preventDefault();
    let ctgryCode = document.getElementById("categoryCode").value;
    let lkupCd = document.getElementById("lookupValueCode").value;
    let addFld1 = document.getElementById("additionalField1").value;
    let addFld2 = document.getElementById("additionalField2").value;
    let addFld3 = document.getElementById("additionalField3").value;
    let shortDescr = document.getElementById("shortdescription").value;
    let longDescr = document.getElementById("longdescription").value;
    let active = (document.getElementById("active").checked ? "Y" : "N");

    if (ctgryCode.length === 0) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter a valid Category Code"});
      document.getElementById("categoryCode").focus();
    } else if (lkupCd.length === 0) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter a valid Lookup Code"});
      document.getElementById("lookupValueCode").focus();
    } else if (shortDescr.length === 0) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter a valid Short Description"});
      document.getElementById("shortdescription").focus();
    } else if (longDescr.length === 0) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter a valid Long Description"});
      document.getElementById("longdescription").focus();
    } else {
      this.setState({categoryCode: ctgryCode, 
        lookupValueCode: lkupCd,
        shortdescription: shortDescr, 
        longdescription:  longDescr, 
        additionalField1:  addFld1, 
        additionalField2:  addFld2, 
        additionalField3:  addFld3, 
        activeIndicator:  active,
        eventAdditionalMessage: "Processing ..."
      });

      fetch('http://localhost:8080/imd-farm-management/lookupvalues/update', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "categoryCode": ctgryCode,
            "lookupValueCode": lkupCd,
            "shortDescription": shortDescr,
            "longDescription": longDescr,
            "additionalField1": addFld1,
            "additionalField2": addFld2,
            "additionalField3": addFld3,
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
    var {eventAdditionalMessage, messageColor} = this.state;
    // if (invalidAccess)
    //   return (<Redirect to='/admin/lookup/search'  />);
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
                           <Link to={'/admin/lookup/search'}><i className="fa fa-search"></i>{' '}</Link><strong>Search</strong>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink id="add-tab"
                          className={classnames({ active: false })}
                          onClick={this.handleTabClick("add-tab")}
                        >
                           <Link to={'/admin/lookup/add'}><i className="fa fa-plus"></i>{' '}</Link><strong>Add</strong>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink id="add-tab"
                          className={classnames({ active: true })}
                          onClick={this.handleTabClick("add-tab")}>
                           <i className="fa fa-pencil"></i>{' '}<strong>Update</strong>
                        </NavLink>
                      </NavItem>
                    </Nav>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
                          </Col>
                        </FormGroup>                      
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Category Code</Label>
                          <Col sm="8">
                            <Input id="categoryCode" disabled type="text" maxLength="10" value={this.state.categoryCode} onChange={this.handleChange} placeholder="Category Code"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Lookup Code</Label>
                          <Col sm="8">
                            <Input id="lookupValueCode" disabled type="text" maxLength="10" value={this.state.lookupValueCode} onChange={this.handleChange} placeholder="Lookup Code"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Active</Label>
                          <Col sm="8">
                            <AppSwitch id="active" className="mx-1" color="success" label checked={this.state.isActive}  />
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
                        <FormGroup row>
                          <Col md="4">
                            <Label htmlFor="textarea-input">Additional Information 1</Label>
                          </Col>
                          <Col md="8">
                            <Input id="additionalField1" type="textarea" name="additionalField1" rows="5" value={this.state.additionalField1} onChange={this.handleChange} placeholder="Additional Information 1"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="4">
                            <Label htmlFor="textarea-input">Additional Information 2</Label>
                          </Col>
                          <Col md="8">
                            <Input id="additionalField2" type="textarea" name="additionalField2" rows="5" value={this.state.additionalField2} onChange={this.handleChange} placeholder="Additional Information 2"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="4">
                            <Label htmlFor="textarea-input">Additional Information 3</Label>
                          </Col>
                          <Col md="8">
                            <Input id="additionalField3" type="textarea" name="additionalField3" rows="5" value={this.state.additionalField3} onChange={this.handleChange} placeholder="Additional Information 3"  />
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleUpdate}><i className="fa fa-pencil"></i>{' '}Update</Button>
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

export default UpdateLookup;