import React, { Component } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Fade,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Table,
  Nav, 
  NavItem, 
  NavLink,
  Dropdown, 
  DropdownItem, 
  DropdownMenu, 
  DropdownToggle 
} from 'reactstrap';

import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class SearchMessage extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      dropdownOpen: new Array(2).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      timeout: 300,
      items: [],
      isLoaded: false,
      categoryCode: "",
      authenticated: true,
      lookupValueCode : "" ,
      languageCD: "",
      languageValue: "",
      messageCD: "",
      messageColor: "muted",
      languageList: [],
      message: "Enter search fields and press Search button"
    };
    this.handleChange = this.handleChange.bind(this); 
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.retrieveLanguageCode = this.retrieveLanguageCode.bind(this);
    this.collapseResults = this.collapseResults.bind(this);
    this.handleLanguageSelected = this.handleLanguageSelected.bind(this);
  }
  retrieveLanguageCode() {
    // retrieve Operator Dropdown values  
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
         this.setState({languageList: [], isLoaded: true, message: data.message, messageColor: "danger"});
      }
      else {
        //alert(data.length);
        this.setState({languageList: data, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));

  }

  componentDidMount() {
    this.retrieveLanguageCode();
   }

  handleLanguageSelected(event) {
    if (event.target.id === "%")
      this.setState({languageCD: "", languageValue: event.target.value});
    else
      this.setState({languageCD: event.target.id, languageValue: event.target.value});    
  }

  handleChange(event) {
    if (event.target.id === "messageCD")
      this.setState({messageCD: event.target.value});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleSearch(event) {
    event.preventDefault();
    this.setState({items: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/messagecatalog/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "languageCD": this.state.languageCD,
          "messageCD": this.state.messageCD,
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
         this.setState({items: [], isLoaded: true, message: data.message, messageColor: "danger"});
      }
      else {
         this.setState({items: data, isLoaded: true, message: (data.length === 1 ? data.length + " matching record found" : data.length + " matching records found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
  }
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  collapseResults() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { authenticated, languageList, isLoaded, items, message, messageColor } = this.state;
    let recordCount = 0;
    if (!authenticated)
      return (<Redirect to='/login'  />);
    return (
      <div className="animated fadeIn">
         <Row>
         <Col xs="7">
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
                          className={classnames({ active: true })}
                          onClick={this.handleTabClick("search-tab")}>
                           <i className="fa fa-search"></i><strong>{' '}Search</strong>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink id="add-tab"
                          className={classnames({ active: false })}
                          onClick={this.handleTabClick("add-tab")}
                        >
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
                          <Col md ="8">
                            <InputGroup>
                              <InputGroupText>
                                <i className="fa icon-list fa-lg mt-1"></i>
                              </InputGroupText>
                              <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.languageValue}
                                </DropdownToggle>
                                <DropdownMenu id="languageCode" onClick={this.handleLanguageSelected}
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
                                  <DropdownItem id="%" value="--Select Language--" >--Select Language--</DropdownItem>                                  
                                  {languageList.map(item => (
                                  <DropdownItem id={item.lookupValueCode} value={item.shortDescription} >{item.longDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md="6">
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa fa-file-code-o fa-lg mt-1"></i>
                                </InputGroupText>
                              <Input id="messageCD" type="number" maxLength="6" value={this.state.messageCD} onChange={this.handleChange} placeholder="Message Code"/>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{message}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleSearch}><i className="fa fa-search"></i>{' '}Search</Button>
                    </CardFooter>
                  </Card>
                </Col>
            </Row>
         </Col>
         </Row>
         <Row>
            <Col xs="10" lg="12">
               <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                  <Card>
                     <CardHeader>
                     <i className="fa fa-align-justify"></i> Messages {(isLoaded ? "": " Loading ...")}
                       <div className="card-header-actions">
                         <Button color="link" className="card-header-action btn-minimize" data-target="#messagedata" onClick={this.collapseResults}><i className="icon-arrow-up"></i></Button>
                       </div>
                     </CardHeader>
                     <Collapse isOpen={this.state.collapse} id="messagedata">
                       <CardBody>
                         <Table hover bordered striped responsive size="lg">
                           <thead>
                              <tr>
                                <th>#</th>
                                <th>Org</th>
                                <th>Language</th>
                                <th>Message Code</th>
                                <th>Message Test</th>
                                <th>Updated By</th>
                                <th>Updated Date</th>
                              </tr>
                           </thead>
                           <tbody>
                             {items.map(item => (
                                 <tr key="{item.orgID + item.languageCD + item.messageCD}">
                                   <td>{++recordCount}</td>
                                   <td>{item.orgID}</td>
                                   <td>{item.languageCD}</td>
                                   <td><Link to={'/admin/messagecatalog/update?languageCD=' + item.languageCD + '&messageCD=' + item.messageCD} >{item.messageCD}</Link></td>
                                   <td>{item.messageText}</td>
                                   <td>{item.updatedBy}</td>
                                   <td>{item.updatedDTTM}</td>
                               </tr>
                               ))}
                           </tbody>
                         </Table>
                       </CardBody>
                     </Collapse> 
                  </Card>
               </Fade>
            </Col>
         </Row>
      </div>
    );
  }
}

export default SearchMessage;
