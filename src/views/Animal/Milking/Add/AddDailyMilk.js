import React, { Component } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
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
  InputGroup,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavLink   
} from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import DateTimePicker from 'react-datetime-picker';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';


class AddDailyMilk extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      dropdownOpen: new Array(2).fill(false),
      warning: false,
      fadeIn: true,
      isLoaded: false,
      timeout: 300,
      animaltaglist: [],
      animalTag: "-- Select Tag --",
      milkingEventNumber: "-- Select Milking Event --",
      milkVolume: "",
      messageColor: "muted",
      timestamp: new Date(),
      comments: "",
      fatValue: "",
      lrValue: "",
      toxinValue: "",
      temperatureInCentigrade: "",
      authenticated: true,
      humidity: "",
      eventAdditionalMessage: "Specify desired values and press Add"
    };
    this.handleAnimalTagSelected = this.handleAnimalTagSelected.bind(this);
    this.handleEventNumberSelected = this.handleEventNumberSelected.bind(this);
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);    
    this.handleValueChanged = this.handleValueChanged.bind(this);
  }


  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleTimestampChanged(newValue) {
    this.setState({timestamp: newValue});
    // if (event.target.id === "alias")
    //   this.setState({alias: event.target.value});
    // if (event.target.id === "longdescription")
    //   this.setState({longdescription: event.target.value});
    // if (event.target.id === "active")
    //   this.setState({activeIndicator: (event.target.checked ? "Y": "N")});
  }
  handleValueChanged(event){
    if (event.target.id === "milkVolume")
      this.setState({milkVolume: event.target.value});
    if (event.target.id === "fatValue") 
      this.setState({fatValue: event.target.value});
    if (event.target.id === "lrValue")
      this.setState({lrValue: event.target.value});
    if (event.target.id === "toxinValue")
      this.setState({toxinValue: event.target.value});
    if (event.target.id === "temperatureInCentigrade")
      this.setState({temperatureInCentigrade: event.target.value});
    if (event.target.id === "humidity")
      this.setState({humidity: event.target.value});
    if (event.target.id === "comments")
      this.setState({comments: event.target.value});
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({lookupValueCode: parsed.lookupValueCode, animaltaglist: [], eventlist: [], operatorlist: [], isLoaded: false}); 

    fetch(API_PREFIX + '/imd-farm-management/animals/lactatingcows', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": "%",
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
         this.setState({animaltaglist: [], isLoaded: true, eventAdditionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({animaltaglist: data, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));

   }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  handleAnimalTagSelected(event) {
    this.setState({animalTag: event.target.value});
  }

  handleEventNumberSelected(event) {
    this.setState({milkingEventNumber: event.target.value});
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }


  handleAdd(event) {
    event.preventDefault();
    //alert(this.state.timestamp.getHours() + ":" + this.state.timestamp.getMinutes() );

    if (this.state.animalTag.length === 0 || this.state.animalTag === "-- Select Tag --") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please select an Animal Tag"});
      document.getElementById("animalTag").focus();
    } else if (this.state.milkingEventNumber.length === 0 || this.state.milkingEventNumber === "-- Select Milking Event --") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please select a milking event"});
      document.getElementById("milkingEventNumber").focus();
    } else if (this.state.milkVolume === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter milk volume"});
      document.getElementById("milkVolume").focus();
    } else if (this.state.temperatureInCentigrade === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter temperature"});
      document.getElementById("temperatureInCentigrade").focus();
    } else {
      this.setState({eventAdditionalMessage: "Processing ..."
      });
      fetch(API_PREFIX + '/imd-farm-management/animals/addmilkingrecord', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": this.state.animalTag,
            "milkingDateStr": this.state.timestamp.getFullYear() + "-" + (this.state.timestamp.getMonth()+1) + "-" + this.state.timestamp.getDate(),
            "milkingTimeStr" : this.state.timestamp.getHours() + ":" + this.state.timestamp.getMinutes(),
            "milkingEventNumber": this.state.milkingEventNumber,
            "milkVolume": this.state.milkVolume,
            "comments": this.state.comments,
            "lrValue": this.state.lrValue,
            "fatValue": this.state.fatValue,
            "toxinValue": this.state.toxinValue,
            "temperatureInCentigrade": this.state.temperatureInCentigrade,
            "humidity": this.state.humidity,
            "timestamp": this.state.timestamp,
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
           this.setState({isLoaded: true, eventAdditionalMessage: data.message, messageColor: "danger"});
        }
        else {
           this.setState({isLoaded: true, eventAdditionalMessage: data.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    }
  }

  render() {
    var { authenticated, eventAdditionalMessage, messageColor, animaltaglist} = this.state;
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
                      <i className="fa fa-align-justify"></i><strong>Animal Milking Information</strong>
                    </CardHeader>
                    <CardBody>
                      <Nav tabs>
                        <NavItem>
                          <NavLink id="search-tab"
                            className={classnames({ active: false })}
                            onClick={this.handleTabClick("search-tab")}>
                              <Link to={'/animal/milking/search'}><i className="fa fa-search"></i></Link><strong>{' '}Search</strong>
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
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Animal Tag</Label>
                          <Col sm="8">
                            <InputGroup>
                              <Dropdown id="animalTag" isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.animalTag}
                                </DropdownToggle>

                                <DropdownMenu onClick={this.handleAnimalTagSelected}
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
                                  {animaltaglist.map(animaltagitem => (
                                  <DropdownItem id={animaltagitem.animalTag} value={animaltagitem.animalTag} >{animaltagitem.animalTag}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Timestamp</Label>
                          <Col sm="8">
                            <DateTimePicker onChange={this.handleTimestampChanged} value={this.state.timestamp} required showLeadingZeros />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Event Number</Label>
                          <Col sm="2">
                            <InputGroup>
                              <Dropdown id="milkingEventNumber" isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.milkingEventNumber}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleEventNumberSelected}>
                                  <DropdownItem id="one" value="1" >1 - Morning Milking</DropdownItem>
                                  <DropdownItem id="two" value="2" >2 - Noon Milking</DropdownItem>
                                  <DropdownItem id="three" value="3">3 - Night Milking</DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Milk Volume</Label>
                          <Col sm="2">
                            <Input id="milkVolume" maxlength="5" type="number" name="milkVolume" value={this.state.milkVolume} onChange={this.handleValueChanged} placeholder="ltr" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Environment</Label>
                          <Col sm="2">
                            <Input id="temperatureInCentigrade" maxlength="5" type="number" name="temperatureInCentigrade" value={this.state.temperatureInCentigrade} onChange={this.handleValueChanged} placeholder="Temp"  />
                          </Col>
                          <Col sm="2">
                            <Input id="humidity" maxlength="5" type="text" name="humidity" value={this.state.humidity} onChange={this.handleValueChanged} placeholder="humidity"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Quality</Label>
                          <Col sm="2">
                            <Input id="fatValue" maxlength="5" type="text" name="fatValue" value={this.state.fatValue} onChange={this.handleValueChanged} placeholder="Fat"  />
                          </Col>
                          <Col sm="2">
                            <Input id="lrValue" maxlength="5" type="text" name="lrValue" value={this.state.lrValue} onChange={this.handleValueChanged} placeholder="LR"  />
                          </Col>
                          <Col sm="2">
                            <Input id="toxinValue" maxlength="5" type="number" name="toxinValue" value={this.state.toxinValue} onChange={this.handleValueChanged} placeholder="toxin"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Comments</Label>
                          <Col sm="8">
                            <Input id="comments" type="textarea" name="comments" rows="3" value={this.state.comments} onChange={this.handleValueChanged} placeholder="Comments"  />
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

export default AddDailyMilk;
