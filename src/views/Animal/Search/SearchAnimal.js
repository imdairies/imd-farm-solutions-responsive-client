import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';


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
   Label,
   Dropdown, 
   DropdownItem, 
   DropdownMenu, 
  DropdownToggle 
} from 'reactstrap';

var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class SearchAnimal extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      dropdownOpen: new Array(4).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      timeout: 300,
      items: [],
      isLoaded: true,
      animalTag: "",
      animalType: "-- Animal Type --",
      animalSireTag: "-- Select Sire --",
      animalSireAlias: "-- Select Sire --",
      animalDamTag: "-- Select Dam --",
      gender: "-- Select Gender --",
      genderValue: "",
      activeOnly: false,
      messageColor: "muted",
      animaltypelist: [],
      sireList:[],
      damList: [],
      eventAdditionalMessage: "Enter search fields and press Search button",
      authenticated: true
    };
    this.handleAnimalTagValueChange = this.handleAnimalTagValueChange.bind(this);
    this.handleActiveOnly = this.handleActiveOnly.bind(this);
    this.handleAnimalTypeSelected = this.handleAnimalTypeSelected.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleSireChange = this.handleSireChange.bind(this);
    this.handleDamChange = this.handleDamChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleDobFromChange = this.handleDobFromChange.bind(this);
    this.handleDobToChange = this.handleDobToChange.bind(this);
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  handleActiveOnly() {
    this.setState({activeOnly: !this.state.activeOnly});
  }


  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    var searchAPI = parsed.searchCode;
    var searchTypeCD = parsed.searchTypeCD;
    var animalTags = parsed.animalTags;
    this.setState({animaltypelist: [], isLoaded: false}); 


    // populate Lifecycle Type dropdown
    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "LCYCL",
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
         this.setState({animaltypelist: [], isLoaded: true, eventAdditionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({animaltypelist: data, isLoaded: true});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));


 //   alert(animalTags);
    if (searchAPI != null) {
      fetch(API_PREFIX + '/imd-farm-management/animals/' + searchAPI, {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify(jsonString)

          body: JSON.stringify({
            "animalTag": "",
            "animalType":searchTypeCD,
            "activeOnly": true,
            "loginToken": (new Cookies()).get('authToken')
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({items: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        } else {
          // alert(responseJson.length);
           this.setState({items: responseJson, isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? responseJson.length + " matching record found" : responseJson.length + " matching records found"), messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (searchTypeCD != null) {
      fetch(API_PREFIX + '/imd-farm-management/animals/search', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify(jsonString)

          body: JSON.stringify({
            "animalTag": "",
            "animalType":searchTypeCD,
            "activeOnly": true,
            "loginToken": (new Cookies()).get('authToken')
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({items: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        } else {
           this.setState({items: responseJson, isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? responseJson.length + " matching record found" : responseJson.length + " matching records found"), messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
   } else if (animalTags != null) {
      fetch(API_PREFIX + '/imd-farm-management/animals/search', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify(jsonString)

          body: JSON.stringify({
            "animalTag": animalTags,
            "animalType":"%",
            "activeOnly": false,
            "loginToken": (new Cookies()).get('authToken')

        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({items: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        } else {
           this.setState({items: responseJson, isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? responseJson.length + " matching record found" : responseJson.length + " matching records found"), messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } 

    fetch(API_PREFIX + '/imd-farm-management/animals/retrieveaisire', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag":"%",
          "loginToken": (new Cookies()).get('authToken')

      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({sireList: [], isLoaded: true, message: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({sireList: responseJson, isLoaded: true, message: ""});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));

    fetch(API_PREFIX + '/imd-farm-management/animals/getalldams', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag":"%",
          "loginToken": (new Cookies()).get('authToken')

      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({damList: [], isLoaded: true, message: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({damList: responseJson, isLoaded: true, message: ""});         
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


  handleGenderChange(event) {
    if (event.target.id === "?")
      this.setState({gender: "-- Select Gender --", genderValue: ""});
    else 
      this.setState({gender: event.target.value, genderValue:event.target.id});
  }

  handleDobToChange(event) {
    this.setState({dobTo: event.target.value});
  }
  handleDobFromChange(event) {
    this.setState({dobFrom: event.target.value});
  }


  handleAnimalTagValueChange(event) {
    this.setState({animalTag: event.target.value});
  }

  handleAnimalTypeSelected(event) {
    this.setState({animalType: event.target.value});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleSearch(event) {
    event.preventDefault();
    this.setState({items: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/animals/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)        

        body: JSON.stringify({
          "animalTag": this.state.animalTag,
          "animalType": (this.state.animalType === "-- Animal Type --" || this.state.animalType === "ALL" ? null : this.state.animalType),
          "sire": (this.state.animalSireTag === "-- Select Sire --" || this.state.animalSireTag === "ALL" ? null : this.state.animalSireTag),
          "dam": (this.state.animalDamTag === "-- Select Dam --" || this.state.animalDamTag === "ALL" ? null : this.state.animalDamTag),
          "gender": this.state.genderValue,
          "dateOfBirthStr": this.state.dobFrom,
          "dobFrom": this.state.dobFrom,
          "dobTo": this.state.dobTo,
          "activeOnly": this.state.activeOnly,
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
         this.setState({items: [], isLoaded: true, eventAdditionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({items: data, isLoaded: true, eventAdditionalMessage: (data.length === 1 ? data.length + " matching record found" : data.length + " matching records found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
  }


  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { authenticated, isLoaded, sireList, damList, items, animaltypelist, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
    let sireCount = 0;
    let damRecordCount = 0;
    if (!authenticated)
      return (<Redirect to='/login'  />);

    return (
      <div className="animated fadeIn">
         <Row>
         <Col xs="7">
           <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
            <Row>
              <Col xs="10" lg="12">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i><strong>Animal Maintenance</strong>
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
                          className={classnames({ active: false })} onClick={this.handleTabClick("add-tab")}
                          >
                           <Link to={'/animal/add'}><i className="fa fa-plus"></i>{' '}</Link><strong>Add</strong>
                        </NavLink>
                      </NavItem>
                    </Nav>
                      <Form action="" method="POST" onSubmit={this.handleSearch} className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-tag fa-lg mt-1"></i>
                                </InputGroupText>
                              <Input id="animalTag" type="text" maxLength="10" value={this.state.animalTag} onChange={this.handleAnimalTagValueChange} placeholder="Animal Tag"/>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-question fa-lg mt-1"></i>
                                </InputGroupText>

                              <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);}}>
                                <DropdownToggle caret>
                                  {this.state.animalSireAlias}
                                </DropdownToggle>
                                <DropdownMenu overflow='auto' onClick={this.handleSireChange}
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
                                  <DropdownItem id="0Sire" value="-1">-- Select Sire --</DropdownItem>
                                  {sireList.map(sire => (<DropdownItem id={sire.animalTag} value={sireCount++}>{sire.animalTag + '-' + sire.alias}</DropdownItem>))}
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroup>                                
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-question fa-lg mt-1"></i>
                                </InputGroupText>
                            <Dropdown isOpen={this.state.dropdownOpen[2]} size="md" toggle={() => {
                              this.toggle(2);}}>
                              <DropdownToggle caret>
                                {this.state.animalDamTag}
                              </DropdownToggle>
                              <DropdownMenu onClick={this.handleDamChange}
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
                                }}
                              >
                                <DropdownItem id="0Dam" value="-1">-- Select Dam --</DropdownItem>
                                {damList.map(dam => (<DropdownItem id={dam.animalTag} value={damRecordCount++}>{dam.animalTag}</DropdownItem>))}
                              </DropdownMenu>
                            </Dropdown>

                              </InputGroup>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col>
                              <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-question fa-lg mt-1"></i>
                                </InputGroupText>
                              <Dropdown isOpen={this.state.dropdownOpen[3]} toggle={() => {
                                this.toggle(3);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.gender}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleGenderChange}>
                                  <DropdownItem id="?" value="-- Select Gender --">-- Select Gender --</DropdownItem>
                                  <DropdownItem id="F" value="Female" >Female</DropdownItem>
                                  <DropdownItem id="M" value="Male" >Male</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-calendar fa-md mt-1"></i>
                                </InputGroupText>
                              <Input id="dobFrom" type="text" maxLength="10" value={this.state.dobFrom} onChange={this.handleDobFromChange} placeholder="Date of Birth From"/>
                            </InputGroup>
                          </Col>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-calendar fa-md mt-1"></i>
                                </InputGroupText>
                              <Input id="dobTo" type="text" maxLength="10" value={this.state.dobTo} onChange={this.handleDobToChange} placeholder="Date of Birth To"/>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-menu fa-lg mt-1"></i>
                                </InputGroupText>
                              <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.animalType}
                                </DropdownToggle>

                                <DropdownMenu onClick={this.handleAnimalTypeSelected}
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
                                  <DropdownItem id="ALL" value="ALL" >ALL</DropdownItem>
                                  {animaltypelist.map(animaltypeitem => (
                                  <DropdownItem id={animaltypeitem.lookupValueCode} value={animaltypeitem.lookupValueCode} >{animaltypeitem.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup check className="checkbox" row>
                        <Col>
                          <Input className="form-check-input" type="checkbox" id="activeOnly" name="activeOnly" value="activeOnly"  onClick={this.handleActiveOnly} />
                          <Label check className="form-check-label" htmlFor="checkbox1">Show active only</Label>
                          </Col>
                        </FormGroup>
                        <FormGroup  row>
                          <Col>
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
                   <i className="fa fa-align-justify"></i> Animals {(isLoaded ? "": " Loading ...")}
                     <div className="card-header-actions">
                       <Button color="link" className="card-header-action btn-minimize" data-target="#animaldata" ></Button>
                     </div>
                   </CardHeader>
                     <CardBody>
                       <Table hover bordered striped responsive size="lg">
                         <thead>
                            <tr>
                              <th>#</th>
                              <th>Tag#</th>
                              <th>Gender</th>
                              <th>Type</th>
                              <th>Status</th>
                              <th>Dam</th>
                              <th>Sire</th>
                              <th>Age</th>
                              <th>Photo</th>
                            </tr> 
                         </thead>
                         <tbody>
                           {items.map(item => (
                               <tr key="{item.animalTag}">
                                 <td>{++recordCount}</td>
                                 <td><Link to={'/animal/update?animalTag=' + item.animalTag + '&orgID=' + item.orgID} >{item.animalTag}</Link></td>
                                 <td>{item.gender === 'M' ? 'Male' : item.gender === 'F' ? 'Female' : ''}</td>
                                 <td>{item.animalType}</td>
                                 <td>{item.animalStatus}</td>
                                 <td><Link to={'/animal/update?animalTag=' + item.animalDam + '&orgID=' + item.orgID} >{item.animalDam}</Link></td>
                                 <td><a rel="noopener noreferrer" href={(item.isBornThroughAI ? item.animalSireURL : '#/animal/update?animalTag=' + item.animalSire + '&orgID=' + item.orgID)} >{item.animalSireAlias + " " + item.animalSire }</a></td>
                                 <td>{item.currentAge}</td>
                                 <td><Link to={'/animal/photo/update?animalTag=' + item.animalTag + '&orgID=' + item.orgID} ><i className="fa icon-camera fa-lg mt-1"></i></Link></td>
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

export default SearchAnimal;
