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
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class AddMessage extends Component {
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
      langCodeList:[],
      messageCD: "",
      languageCD: "",
      languageValue: "",
      messageText: "",
      authenticated: true,
      messageColor: "muted",
      message: "Specify desired values and press Add button"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);    
    this.handleLanguageCodeChange = this.handleLanguageCodeChange.bind(this);
  }

  handleLanguageCodeChange(event) {
    this.setState({languageCD: this.state.langCodeList[event.target.id].lookupValueCode,
      languageValue:this.state.langCodeList[event.target.id].shortDescription});

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
          "categoryCode": "LANG_CODE",
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
         this.setState({langCodeList: [], isLoaded: true, message: data.message, messageColor: "danger"});
      }
      else {
         this.setState({langCodeList: data, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));


   }

  handleTabClick(targetID) {
  }

  handleChange(event) {
    if (event.target.id === "messageCD")
      this.setState({messageCD: event.target.value});
    if (event.target.id === "messageText")
      this.setState({messageText: event.target.value});
  }

  handleAdd(event) {
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

      fetch(API_PREFIX + '/imd-farm-management/messagecatalog/add', {
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
    var { authenticated, message, langCodeList, messageColor} = this.state;
    let itemCount = 0;
    if (!authenticated)
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
                          <Label sm="4" htmlFor="input-normal">Language Code</Label>
                          <Col sm="8">
                            <InputGroup>
                              <Dropdown id="languageCD" isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.languageValue}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleLanguageCodeChange}
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
                                  {langCodeList.map(item => (
                                  <DropdownItem id={itemCount++} value={item.lookupValueCode} >{item.shortDescription + " (" + item.lookupValueCode + ")"}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Message Code</Label>
                          <Col sm="8">
                            <Input id="messageCD" type="number" maxLength="10" value={this.state.messageCD} onChange={this.handleChange} placeholder="Message Unique Code"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Message Text</Label>
                          <Col sm="8">
                              <Input id="messageText" type="textarea" maxLength="255" value={this.state.messageText} onChange={this.handleChange} placeholder="Message Text"  />
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{message}</FormText>
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

export default AddMessage;
