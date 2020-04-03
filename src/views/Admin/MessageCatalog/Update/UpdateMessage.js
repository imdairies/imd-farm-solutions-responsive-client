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
  InputGroup,
  Input,
  Row,
  Label,
  Nav, 
  NavItem, 
  NavLink,   
  Dropdown, 
  DropdownItem, 
  DropdownMenu, 
  DropdownToggle,
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
      dropdownOpen: new Array(1).fill(false),
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
      message: "Specify edit message text and press Update button",
      categoryList: [],
      messageCategoryCD:"",
      messageCategoryValue:"",
    };
    this.toggle = this.toggle.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);    
    this.handleMessageCategorySelected = this.handleMessageCategorySelected.bind(this);
    this.retrieveMessageCategory = this.retrieveMessageCategory.bind(this);
  }
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  retrieveMessageCategory() {

    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "MSG_CTGRY",
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
         this.setState({categoryList: [], isLoaded: true, message: data.message, messageColor: "danger"});
      }
      else {
        //alert(data.length);
        this.setState({categoryList: data, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));

  }
  handleMessageCategorySelected(event) {

    if (event.target.id === "-1") {
    this.setState({messageCategoryCD: "", isRecordDirty: true, 
      messageCategoryValue:"-- Select Message Category --"});
    } else {
      this.setState({messageCategoryCD: this.state.categoryList[event.target.id].lookupValueCode,
        messageCategoryValue:this.state.categoryList[event.target.id].shortDescription, isRecordDirty: true});
    }
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    let invalidAccess = false;
    if (!parsed.messageCD)
      invalidAccess = true;
    if (!parsed.languageCD)
      invalidAccess = true;
    this.setState({invalidAccess: invalidAccess,items: [], isLoaded: false, message: "Processing ..."}); 

    this.retrieveMessageCategory();


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
         this.setState({languageCD: "",
          messageCD: "",  
          messageCategoryCD: "", 
          messageCategoryDescription: "",
          messageCategoryValue: "",
          messageText:data[0].messageText, 
          isLoaded: true, 
          message: data.message, 
          messageColor: "danger"});
      }
      else {
         this.setState({languageCD: data[0].languageCD,
          messageCD: data[0].messageCD,
          messageCategoryDescription: data[0].messageCategoryDescription,
          messageCategoryValue: data[0].messageCategoryDescription,
          messageCategoryCD: data[0].messageCategoryCD.length === 0 ? "-- Select Message Category --" : data[0].messageCategoryCD ,
          messageText:data[0].messageText,
          isLoaded: true,
          message: (data.length === 1 ? data.length + " matching record found" : data.length + " matching records found"), messageColor: "success"});         
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
    let messageCategoryCD = this.state.messageCategoryCD;
    let messageText = this.state.messageText;
//    alert("[" + languageCD + "] [" + messageCD + "] [" + messageText + "]");

    if (languageCD.length === 0) {
      this.setState({messageColor: "danger", message: "Please select a valid Language Code"});
      document.getElementById("languageCD").focus();
    } else if (messageCD.length === 0) {
      this.setState({messageColor: "danger", message: "Please enter a valid Message Code"});
      document.getElementById("messageCD").focus();
    } else if (messageCategoryCD.length === 0) {
      this.setState({messageColor: "danger", message: "Please enter a valid Message Category"});
      document.getElementById("messageCD").focus();
    } else if (messageText.length === 0) {
      this.setState({messageColor: "danger", message: "Please enter Message Text"});
      document.getElementById("messageText").focus();
    } else {
      this.setState({messageCD: messageCD, messageCategoryCD: messageCategoryCD,
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
            "messageCategoryCD": messageCategoryCD,
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
    var { authenticated, categoryList, invalidAccess, message, messageColor} = this.state;
    let categoryCount = -1;
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
                          <Label sm="4" htmlFor="input-normal">Message Category</Label>
                          <Col md ="8">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.messageCategoryValue}
                                </DropdownToggle>
                                <DropdownMenu id="messageCategory" onClick={this.handleMessageCategorySelected}
                                modifiers={{
                                  setMaxHeight: {
                                    enabled: true,
                                    order: 890,
                                    fn: (data) => {
                                      return {
                                        ...data,
                                        styles: {
                                          ...data.styles,
                                          overflow: 'auto',
                                          maxHeight: 400,
                                        },
                                      };
                                    },
                                  },
                                }}>
                                  <DropdownItem id={categoryCount++} value="-- Select Message Category --" >-- Select Message Category --</DropdownItem>                                  
                                  {categoryList.map(item => (
                                  <DropdownItem id={categoryCount++} value={item.shortDescription} >{item.longDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
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
