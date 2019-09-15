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
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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



class AddLookup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: new Array(1).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      items: [],
      isLoaded: false,
      timeout: 300,
      isActive: false,
      categoryCode: "",
      categoryCodeList:[],
      codeDescription: "",
      lookupValueCode : "" ,
      shortdescription: "",
      longdescription: "",
      activeIndicator : "N" ,
      additionalField1: "",
      messageColor: "muted",
      eventAdditionalMessage: "Specify desired values and press Add button"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);    
    this.handleCategoryCodeChange = this.handleCategoryCodeChange.bind(this);
  }

  handleCategoryCodeChange(event) {
    // alert(event.target.id + " " + this.state.categoryCodeList[event.target.id].lookupValueCode);
    this.setState({categoryCode: this.state.categoryCodeList[event.target.id].lookupValueCode,
      codeDescription:this.state.categoryCodeList[event.target.id].shortDescription});

  }


  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }


  componentDidMount() {

    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "LVCTG",
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({categoryCodeList: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({categoryCodeList: responseJson, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));


   }

  handleTabClick(targetID) {
  }

  handleChange(event) {
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

  handleAdd(event) {
    event.preventDefault();
    let lkupCd = document.getElementById("lookupValueCode").value;
    let addFld1 = document.getElementById("additionalField1").value;
    let shortDescr = document.getElementById("shortdescription").value;
    let longDescr = document.getElementById("longdescription").value;
    let active = (document.getElementById("active").checked ? "Y" : "N");

    if (this.state.categoryCode === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please select a valid Category Code"});
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
      this.setState({lookupValueCode: lkupCd,
        shortdescription: shortDescr, 
        longdescription:  longDescr, 
        additionalField1:  addFld1, 
        activeIndicator:  active,
        eventAdditionalMessage: "Processing ..."
      });

      fetch(API_PREFIX + '/imd-farm-management/lookupvalues/add', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "categoryCode": this.state.categoryCode,
            "lookupValueCode": lkupCd,
            "shortDescription": shortDescr,
            "longDescription": longDescr,
            "additionalField1": addFld1,
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
    var { eventAdditionalMessage, categoryCodeList, messageColor} = this.state;
    let itemCount = 0;
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
                          className={classnames({ active: true })}
                          onClick={this.handleTabClick("add-tab")}>
                           <i className="fa fa-plus"></i>{' '}<strong>Add</strong>
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
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.codeDescription}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleCategoryCodeChange}>
                                  {categoryCodeList.map(item => (
                                  <DropdownItem id={itemCount++} value={item.lookupValueCode} >{item.shortDescription + " (" + item.lookupValueCode + ")"}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Lookup Code</Label>
                          <Col sm="8">
                            <Input id="lookupValueCode" type="text" maxLength="10" value={this.state.lookupValueCode} onChange={this.handleChange} placeholder="Lookup Code"  />
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
                        <FormGroup row>
                          <Col md="4">
                            <Label htmlFor="textarea-input">Additional Information</Label>
                          </Col>
                          <Col md="8">
                            <Input id="additionalField1" type="textarea" name="additionalField1" rows="5" value={this.state.additionalField1} onChange={this.handleChange} placeholder="Additional Information 1"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="4">
                            <Label htmlFor="textarea-input">Additional Information</Label>
                          </Col>
                          <Col md="8">
                            <Input id="additionalField2" type="textarea" name="additionalField2" rows="5" value={this.state.additionalField2} onChange={this.handleChange} placeholder="Additional Information 2"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="4">
                            <Label htmlFor="textarea-input">Additional Information</Label>
                          </Col>
                          <Col md="8">
                            <Input id="additionalField3" type="textarea" name="additionalField3" rows="5" value={this.state.additionalField3} onChange={this.handleChange} placeholder="Additional Information 3"  />
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

export default AddLookup;
