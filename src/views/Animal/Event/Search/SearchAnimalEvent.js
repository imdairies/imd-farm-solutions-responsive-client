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
//var API_PREFIX = 'http://52.14.65.112:8080';



class SearchAnimalEvent extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      dropdownOpen: new Array(1).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      timeout: 300,
      eventlist: [],
      eventSearchFilterlist: [],
      eventCode: "ALL",
      eventCodeID: "%",
      isLoaded: true,
      animalTag: "",
      messageColor: "muted",
      animaltaglist: [],
      authenticated: true,
      eventAdditionalMessage: "Enter Animal Tag and press search button",
      testDate: new Date()
    };
    this.handleAnimalTagChanged = this.handleAnimalTagChanged.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleEventSelected = this.handleEventSelected.bind(this);
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

    // retrieve Event Dropdown values  
    fetch(API_PREFIX + '/imd-farm-management/lv-lifecycle-event/allactive')
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({eventSearchFilterlist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {     
         this.setState({eventSearchFilterlist: responseJson, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});   
         //alert(this.state.eventlist.length);      
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));

  //   const parsed = queryString.parse(this.props.location.search);
  //   this.setState({lookupValueCode: parsed.lookupValueCode});
  //   this.setState({animaltaglist: [], isLoaded: false}); 
  //   fetch(API_PREFIX + '/imd-farm-management/animals/search', {
  //       method: "POST",
  //       headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         "animalTag": "%",
  //     })
  //   })
  //   .then(response => response.json())
  //   .then(responseJson => {
  //     if (responseJson.error) {
  //        this.setState({animaltaglist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
  //     }
  //     else {
  //        this.setState({animaltaglist: responseJson, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});         
  //     }
  //   })
  //   .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));

   }


  handleAnimalTagChanged(event) {
    this.setState({animalTag: event.target.value});
  }
  handleEventSelected(event) {
    this.setState({eventCode: event.target.value, eventCodeID: event.target.id});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleSearch(event) {
    event.preventDefault();
    if (this.state.animalTag === "" ) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please specifiy an Animal Tag to view its life time events"});
    }
    else {
      this.setState({eventlist: [], isLoaded: false}); 
      fetch(API_PREFIX + '/imd-farm-management/animalevent/search', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify(jsonString)

          body: JSON.stringify({
            "animalTag": this.state.animalTag,
            "eventCode": this.state.eventCodeID,
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
           this.setState({eventlist: [], isLoaded: true, eventAdditionalMessage: data.message, messageColor: "danger"});
        }
        else {
           this.setState({eventlist: data, isLoaded: true, eventAdditionalMessage: (data.length === 1 ? data.length + " life time event found" : data.length + " life time events found"), messageColor: "success"});
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    }
  }


  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { authenticated, isLoaded, eventlist, eventSearchFilterlist, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
    if (!authenticated)
      return (<Redirect to='/login'  />);
    return (
      <div className="animated fadeIn">
         <Row>
         <Col xs="7">
           <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i><strong>Animal Event Maintenance</strong>
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
                           <Link to={'/animal/event/add'}><i className="fa fa-plus"></i>{' '}</Link><strong>Add</strong>
                        </NavLink>
                      </NavItem>
                    </Nav>
                      <Form action="" method="post" onSubmit={this.handleSearch} className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col lg ="3">
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-tag fa-lg mt-1"></i>
                                </InputGroupText>
                              <Input id="animalTag" type="text" maxLength="10" value={this.state.animalTag} onChange={this.handleAnimalTagChanged} placeholder="Animal Tag"/>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col md ="6">
                            <InputGroup>
                              <InputGroupText>
                                <i className="fa icon-list fa-lg mt-1"></i>
                              </InputGroupText>
                              <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.eventCode}
                                </DropdownToggle>

                                <DropdownMenu id="eventCode" onClick={this.handleEventSelected}
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
                                  <DropdownItem id="%" value="ALL" >ALL</DropdownItem>                                  
                                  {eventSearchFilterlist.map(item => (
                                  <DropdownItem id={item.eventCode} value={item.eventShortDescription} >{item.eventShortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleSearch}><i className="fa fa-search"></i>{' '}Search</Button>
                    </CardFooter>
                  </Card>
                </Col>
            </Row>
           </Fade>
         </Col>
         </Row>
         <Row>
            <Col xs="10" lg="12">
               <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                  <Card>
                     <CardHeader>
                     <i className="fa fa-align-justify"></i> Life Events of Tag # {this.state.animalTag} {(isLoaded ? "": " (Loading ...)")}
                     </CardHeader>
                       <CardBody>
                         <Table hover bordered striped responsive size="sm">
                           <thead>
                              <tr>
                                <th>#</th>
                                <th>Timestamp</th>
                                <th>Type</th>
                                <th>Operator</th>
                                <th>Day(s) Ago</th>
                                <th>Age at Event</th>
                                <th>Auxilliary Info</th>
                                <th>Comments</th>
                              </tr> 
                           </thead>
                           <tbody>
                             {eventlist.map(item => (
                                 <tr key="{item.animalTag}">
                                   <td>{eventlist.length - ++recordCount + 1}</td>
                                   <td width="10%" data-toggle="tooltip" title={item.eventTimeStamp.substring(item.eventTimeStamp.length-8).trim()}>{item.eventTimeStamp.substring(0,item.eventTimeStamp.length-8).trim()}</td>
                                   <td><Link to={'/animal/event/update?eventTransactionID=' + item.eventTransactionID} >{item.eventShortDescription}</Link></td>
                                   <td>{item.eventOperator}</td>
                                   <td>{item.daysFromToday}</td>
                                   <td>{item.ageWhenOccurred}</td>
                                   <td>{item.formattedComments}</td>
                                   <td width="50%">{item.eventComments}</td>
                               </tr>
                               ))}
                           </tbody>
                         </Table>
                       </CardBody>
                  </Card>
               </Fade>
            </Col>
         </Row>
      </div>
    );
  }
}

export default SearchAnimalEvent;
