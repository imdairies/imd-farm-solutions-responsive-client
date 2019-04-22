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
  InputGroup,
  InputGroupText,
  Row,
  Label,
  Nav, 
  NavItem, 
  NavLink,   
  Dropdown, 
  DropdownItem, 
  DropdownMenu, 
  DropdownToggle 
} from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';




class AddAnimal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: new Array(6).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      items: [],
      isLoaded: false,
      timeout: 300,
      animalTag : "" ,
      alias: "",
      longdescription: "",
      animaltypelist: [],
      gender : "-- Select Gender --",
      dobAccuracyInd: "No",
      timestampOfBirth: new Date(),
      sireList:[],
      animalSireAlias: "-- Select Sire --",
      animalSireTag: "",
      animalDamAlias: "-- Select Dam --",
      damList:[],
      animalType: "-- Animal Type --",
      animalDamTag: "-- Select Dam --",
      aiIndicator: "Yes",
//      activeIndicator : "N" ,
      messageColor: "muted",
      message: "Specify desired values and press Add"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);   
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleAnimalTypeSelected = this.handleAnimalTypeSelected.bind(this);
    this.handleGenderChanged = this.handleGenderChanged.bind(this);
    this.handleDOBAccuracyIndChanged = this.handleDOBAccuracyIndChanged.bind(this);
    this.handleSireChange = this.handleSireChange.bind(this);
    this.handleDamChange = this.handleDamChange.bind(this);
    this.handleAIIndicatorChanged = this.handleAIIndicatorChanged.bind(this);

  }

  componentDidMount() {
    this.setState({animaltypelist: [], isLoaded: false}); 
    fetch('http://localhost:8080/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "LCYCL",
          "activeIndicator": "Y",
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({animaltypelist: [], isLoaded: true, message: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({animaltypelist: responseJson, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));


    fetch('http://localhost:8080/imd-farm-management/animals/retrieveaisire', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag":"%",
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({sireList: [], isLoaded: true, message: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({sireList: responseJson, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));

    fetch('http://localhost:8080/imd-farm-management/animals/getactivedams', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag":"%",
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({damList: [], isLoaded: true, message: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({damList: responseJson, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));


   }

  handleSireChange(event) {
    if (event.target.value === "-1") {
      this.setState({animalSireTag: null, animalSireAlias: "-- Select Sire --" , animalSireURL: null});
    }
    else 
      this.setState({animalSireTag: this.state.sireList[event.target.value].animalTag, animalSireAlias: this.state.sireList[event.target.value].alias, animalSireURL: this.state.sireList[event.target.value].sireDataSheet});
  }
  handleDamChange(event) {
    if (event.target.value === "-1") {
      this.setState({animalDamTag: "-- Select Dam --", animalDamAlias: "-- Select Dam --"});
    }
    else 
      this.setState({animalDamTag: this.state.damList[event.target.value].animalTag, animalDamAlias: this.state.damList[event.target.value].alias});
  }

  handleAIIndicatorChanged(event) {
    this.setState({aiIndicator: event.target.value});
  }


  handleAnimalTypeSelected(event) {
    let gender = "-- Select Gender --";

    if (event.target.value === "MALECALF" || event.target.value === "BULL")
      gender = "Male";
    else if (event.target.value === "DRYPREG"    || 
      event.target.value === "FEMALECALF"    || 
      event.target.value === "HEIFER"    || 
      event.target.value === "HFRPREGN"    || 
      event.target.value === "LACTATING"    || 
      event.target.value === "LCTINSEMIN"    || 
      event.target.value === "LCTPRGNT")
      gender = "Female";

    this.setState({animalType: event.target.value, gender: gender});
  }
  handleDOBAccuracyIndChanged(event) {
    this.setState({dobAccuracyInd: event.target.value});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }
  handleTimestampChanged(newValue) {
    this.setState({timestampOfBirth: newValue});
  }
  handleChange(event) {
    if (event.target.id === "animalTag")
      this.setState({animalTag: event.target.value});
    else if (event.target.id === "alias")
      this.setState({alias:event.target.value});
    // if (event.target.id === "alias")
    //   this.setState({alias: event.target.value});
    // if (event.target.id === "longdescription")
    //   this.setState({longdescription: event.target.value});
    // if (event.target.id === "active")
    //   this.setState({activeIndicator: (event.target.checked ? "Y": "N")});
  }


  handleGenderChanged(event) {
    this.setState({gender: event.target.value});
  }


  handleAdd(event) {
    event.preventDefault();
    let animalTag = document.getElementById("animalTag").value;
    let alias = document.getElementById("alias").value;
    let gender = this.state.gender;

    if (animalTag.length === 0) {
      this.setState({messageColor: "danger", message: "Please enter a valid Animal Tag"});
      document.getElementById("animalTag").focus();
    } else if (gender === "-- Select Gender --" || gender.length === 0) {
      this.setState({messageColor: "danger", message: "Please select the animal gender"});
    } else {
      this.setState({message: "Processing ..."
      });
      fetch('http://localhost:8080/imd-farm-management/animals/addanimal', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": this.state.animalTag,
            "alias": alias,
            "gender" : (this.state.gender == "Female" ? "F" : "M"),
            "dobAccuracyInd" : (this.state.dobAccuracyInd == "Yes" ? "Y" : "N"),
            "sire" : (this.state.animalSireAlias == "-- Select Sire --"  ? null : this.state.animalSireTag),
            "dam" : (this.state.animalDamTag == "-- Select Dam --"  ? null : this.state.animalDamTag),
            "dateOfBirthStr": this.state.timestampOfBirth.toLocaleString(),
            "aiInd": this.state.aiIndicator,
            "animalType": (this.state.animalType === "-- Animal Type --" ? null : this.state.animalType)
            // "eventLongDescription": longDescr,
            // "activeIndicator": active
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({isLoaded: true, message: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({isLoaded: true, message: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
    }
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }


  render() {
    var { message, messageColor, animaltypelist, sireList, damList} = this.state;
    let recordCount = 0;
    let damRecordCount = 0;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="8">
                 <Nav tabs>
                    <NavItem>
                      <NavLink id="360-view"
                        className={classnames({ active: false })}
                        onClick={this.handleTabClick("search-tab")}
                      >
                         <Link to={'/animal/search'}><i className="fa fa-search"></i>{' '}</Link><strong>360° View</strong>
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
                          <Label sm="4" htmlFor="input-normal">Animal Tag</Label>
                          <Col sm="8">
                            <Input id="animalTag" type="text" maxLength="10" value={this.state.animalTag} onChange={this.handleChange} placeholder="Animal Tag"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Animal Alias</Label>
                          <Col sm="8">
                              <Input id="alias" type="text" maxLength="75" value={this.state.alias} onChange={this.handleChange} placeholder="Animal Alias"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Date of Birth</Label>
                          <Col sm="8">
                            <DateTimePicker onChange={this.handleTimestampChanged} value={this.state.timestampOfBirth} required showLeadingZeros />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">D.O.B Accurate?</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.dobAccuracyInd}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleDOBAccuracyIndChanged}>
                                  <DropdownItem id="Y" value="Yes" >Yes</DropdownItem>
                                  <DropdownItem id="N" value="No" >No</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Animal Type</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.animalType}
                                </DropdownToggle>

                                <DropdownMenu onClick={this.handleAnimalTypeSelected}>
                                  {animaltypelist.map(animaltypeitem => (
                                  <DropdownItem id={animaltypeitem.lookupValueCode} value={animaltypeitem.lookupValueCode} >{animaltypeitem.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Gender</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[2]} toggle={() => {
                                this.toggle(2);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.gender}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleGenderChanged}>
                                  <DropdownItem id="F" value="Female" >Female</DropdownItem>
                                  <DropdownItem id="M" value="Male" >Male</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Sire</Label>
                          <Col sm="4">
                            <Dropdown isOpen={this.state.dropdownOpen[3]} toggle={() => {
                              this.toggle(3);}}>
                              <DropdownToggle caret>
                                {this.state.animalSireAlias}
                              </DropdownToggle>
                              <DropdownMenu onClick={this.handleSireChange}>
                                <DropdownItem id="0Sire" value="-1">-- Select Sire --</DropdownItem>
                                {sireList.map(sire => (<DropdownItem id={sire.animalTag} value={recordCount++}>{sire.animalTag + '-' + sire.alias}</DropdownItem>))}
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Dam</Label>
                          <Col sm="4">
                            <Dropdown isOpen={this.state.dropdownOpen[4]} toggle={() => {
                              this.toggle(4);}}>
                              <DropdownToggle caret>
                                {this.state.animalDamTag}
                              </DropdownToggle>
                              <DropdownMenu onClick={this.handleDamChange}>
                                <DropdownItem id="0Dam" value="-1">-- Select Dam --</DropdownItem>
                                {damList.map(dam => (<DropdownItem id={dam.animalTag} value={damRecordCount++}>{dam.animalTag}</DropdownItem>))}
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Born through AI?</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[5]} toggle={() => {
                                this.toggle(5);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.aiIndicator}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleAIIndicatorChanged}>
                                  <DropdownItem id="Y" value="Yes" >Yes</DropdownItem>
                                  <DropdownItem id="N" value="No" >No</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroup>
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

export default AddAnimal;
