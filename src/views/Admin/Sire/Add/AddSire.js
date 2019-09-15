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

var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';


class AddSire extends Component {
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
      sireList:[],

      controller: "",

      sireOriginCode: "",
      sireOrignDescription: "",
      isFarmSire: false,
      isExternalSire: false,
      categoryCodeList: [],
      breedCodeList: [],
      breed: "",
      semenCompanyCodeList: [],
      semenCompany: "",

      messageColor: "muted",
      message: "Specify whether this Sire is from our farm's herd or whether you are going to purchase the semen from a vendor"
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);   
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleSireOriginSelected = this.handleSireOriginSelected.bind(this);
    this.setupFarmSireInformation = this.setupFarmSireInformation.bind(this);
    this.setupExternalSireInformation = this.setupExternalSireInformation.bind(this);
    this.handleSireChange = this.handleSireChange.bind(this);
    this.handleControllerSelected = this.handleControllerSelected.bind(this);
    this.handleBreedSelected = this.handleBreedSelected.bind(this);
    this.handleSemenCompanySelected = this.handleSemenCompanySelected.bind(this);
  }

  componentDidMount() {

   }

  handleSireChange(event) {
    //alert(event.target.id);
    const serverPathname = this.props.location.pathname;
    let serverURL = window.location.href;
    serverURL = serverURL.substring(0,serverURL.indexOf(serverPathname)-1)

    fetch(API_PREFIX + '/imd-farm-management/animals/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": event.target.value
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
        this.setState({message: responseJson.message, messageColor: "danger"});
      } else {
        this.setState({
            animalTag: responseJson[0].animalTag, 
            breed : responseJson[0].breed,
            alias: responseJson[0].alias,
            semenInd : false,
            semenCompany: responseJson[0].orgID,
            recordURL: serverURL + "#/animal/update?animalTag=" + responseJson[0].animalTag + "&orgID=" + responseJson[0].orgID,
            controller : responseJson[0].orgID,
            photoURL:  responseJson[0].rightSideImageURL,
            currentSexListPrice: "",
            discountSexPercentage: "",
            currentConventionalListPrice: "",
            discountConventionalPercentage: ""
        });
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
  }

  handleSireOriginSelected(event) {
    this.setState({sireOriginCode: event.target.id, sireOrignDescription:event.target.value, message: ""});
    if (event.target.id === "INTERNAL") {
      this.setupFarmSireInformation();
    } else if (event.target.id === "EXTERNAL") {
      this.setupExternalSireInformation();
    }


    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "CONTROLLER"
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({categoryCodeList: [], isLoaded: true, message: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({categoryCodeList: responseJson, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));


    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "BREED"
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({breedCodeList: [], isLoaded: true, message: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({breedCodeList: responseJson, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));

    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "SMNMR"
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({semenCompanyCodeList: [], isLoaded: true, message: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({semenCompanyCodeList: responseJson, isLoaded: true, message: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
  }

  handleSemenCompanySelected (event) {
    this.setState({semenCompany: event.target.value});    
  }

  handleBreedSelected (event) {
    this.setState({breed: event.target.value});    
  }

  handleControllerSelected (event) {
    this.setState({controller: event.target.value});
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
      this.setState({alias:event.target.value.toUpperCase()});
    else if (event.target.id === "recordURL")
      this.setState({recordURL: event.target.value});
    else if (event.target.id === "photoURL")
      this.setState({photoURL: event.target.value});
    else if (event.target.id === "currentSexListPrice")
      this.setState({currentSexListPrice: event.target.value});
    else if (event.target.id === "currentConventionalListPrice")
      this.setState({currentConventionalListPrice: event.target.value});
    else if (event.target.id === "discountSexPercentage")
      this.setState({discountSexPercentage: event.target.value});
    else if (event.target.id === "discountConventionalPercentage")
      this.setState({discountConventionalPercentage: event.target.value});
  }

setupFarmSireInformation() {
  this.setState({
        isFarmSire: true,
        isExternalSire: false,
        sireList: [],
        animalTag: "" , 
        breed : "",
        alias: "",
        semenInd : true,
        semenCompany: "",
        recordURL:"",
        controller : "",
        photoURL: "",
        currentSexListPrice: "",
        discountSexPercentage: "",
        currentConventionalListPrice: "",
        discountConventionalPercentage: ""
      });    


    // populate the Sire Tag list
        fetch(API_PREFIX + '/imd-farm-management/animals/retrievefarmsire', {
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

  }
  setupExternalSireInformation() {
    this.setState({
      isFarmSire: false,
      isExternalSire: true,
      sireList: [],
      animalTag: "" , 
      breed : "",
      alias: "",
      semenInd : false,
      semenCompany: "",
      recordURL:"",
      controller : "",
      photoURL: "",
      currentSexListPrice: "",
      discountSexPercentage: "",
      currentConventionalListPrice: "",
      discountConventionalPercentage: ""
    });
  }

  handleAdd(event) {
    event.preventDefault();

    if (this.state.sireOrignDescription === ""){
      this.setState({messageColor: "danger", message: "Please enter a valid Sire Origin"});
    } else if (this.state.animalTag === "") {
      this.setState({messageColor: "danger", message: "Please enter a valid Sire Code/Tag"});
    } else if (this.state.alias === "") {
      this.setState({messageColor: "danger", message: "Please enter sire name/alias"});
    } else if (this.state.controller === "") {
      this.setState({messageColor: "danger", message: "Please select a controller"});
    } else {
      this.setState({message: "Processing ..."
      });
      fetch(API_PREFIX + '/imd-farm-management/animals/addsire', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": this.state.animalTag,
            "alias": this.state.alias.toUpperCase(),
            "breed": this.state.breed,
            "semenInd": (this.state.isExternalSire ? "Y" : "N"),
            "recordURL" : this.state.recordURL,
            "photoURL" : this.state.photoURL,
            "controller": this.state.controller,
            "semenCompany": this.state.semenCompany,
            "currentSexListPrice": this.state.currentSexListPrice,
            "discountSexPercentage": this.state.discountSexPercentage,
            "currentConventionalListPrice": this.state.currentConventionalListPrice,
            "discountConventionalPercentage": this.state.discountConventionalPercentage
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
    var { message, messageColor, categoryCodeList, breedCodeList, sireList, semenCompanyCodeList} = this.state;
    let showFarmSireFields = this.state.isFarmSire ? {} : {display : 'none'};
    let showExternalSireFields = this.state.isExternalSire ? {} : {display : 'none'};
    let hide = this.state.isExternalSire || this.state.isFarmSire ? {} : {display : 'none'};

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="9">
                 <Nav tabs>
                    <NavItem>
                      <NavLink id="Sire-List"
                        className={classnames({ active: false })}
                        onClick={this.handleTabClick("search-tab")}
                      >
                         <Link to={'/admin/sire/search'}><i className="fa fa-list"></i>{' '}</Link><strong>Sire List</strong>
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
                          <Label sm="3" htmlFor="input-normal">Sire Origin</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[5]} toggle={() => {
                                this.toggle(5);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.sireOrignDescription}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleSireOriginSelected}>
                                  <DropdownItem id="INTERNAL" value="Farm's Herd" >Farm's Herd</DropdownItem>
                                  <DropdownItem id="EXTERNAL" value="External" >External</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>

                        <FormGroup row style={showExternalSireFields} >
                          <Label sm="3" htmlFor="input-normal">Sire Code</Label>
                          <Col sm="4">
                            <Input id="animalTag" type="text" maxLength="25" value={this.state.animalTag} onChange={this.handleChange} placeholder="e.g. Sire Holstein Code"  />
                          </Col>
                        </FormGroup>

                        <FormGroup row style={showFarmSireFields} >
                          <Label sm="3" htmlFor="input-normal">Sire Tag</Label>
                          <Col sm="4">
                            <Dropdown isOpen={this.state.dropdownOpen[3]} toggle={() => {
                              this.toggle(3);}}>
                              <DropdownToggle caret>
                                {this.state.animalTag}
                              </DropdownToggle>
                              <DropdownMenu onClick={this.handleSireChange}
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
                                {sireList.map(sire => (<DropdownItem id={sire.animalTag} value={sire.animalTag}>{sire.animalTag + '-' + sire.alias}</DropdownItem>))}
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                        </FormGroup>


                        <FormGroup row style={hide} >
                          <Label sm="3" htmlFor="input-normal">Sire Name</Label>
                          <Col sm="4">
                              <Input id="alias" type="text" maxLength="50" value={this.state.alias} onChange={this.handleChange} placeholder="Animal Alias"  />
                          </Col>
                        </FormGroup>


                        <FormGroup row style={hide} >
                          <Label sm="3" htmlFor="input-normal">Record URL</Label>
                          <Col sm="7">
                            <Input id="recordURL" type="text" maxLength="1024" value={this.state.recordURL} onChange={this.handleChange} placeholder="http://..."  />
                          </Col>
                        </FormGroup>

                        <FormGroup row style={hide} >
                          <Label sm="3" htmlFor="input-normal">Photo URL</Label>
                          <Col sm="7">
                            <Input id="photoURL" type="text" maxLength="1024" value={this.state.photoURL} onChange={this.handleChange} placeholder="http://..."  />
                          </Col>
                        </FormGroup>


                        <FormGroup row style={hide} >
                          <Label sm="3" htmlFor="input-normal">Breed</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown disabled readonly isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.breed}
                                </DropdownToggle>

                                <DropdownMenu onClick={this.handleBreedSelected}
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
                                  {breedCodeList.map(item => (
                                  <DropdownItem id={item.lookupValueCode} value={item.lookupValueCode} >{item.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row style={hide} >
                          <Label sm="3" htmlFor="input-normal">Controller</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[2]} toggle={() => {
                                this.toggle(2);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.controller}
                                </DropdownToggle>

                                <DropdownMenu onClick={this.handleControllerSelected}
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
                                  {categoryCodeList.map(animaltypeitem => (
                                  <DropdownItem id={animaltypeitem.lookupValueCode} value={animaltypeitem.lookupValueCode} >{animaltypeitem.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row style={hide} >
                          <Label sm="3" htmlFor="input-normal">Marketed By</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[4]} toggle={() => {
                                this.toggle(4);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.semenCompany}
                                </DropdownToggle>

                                <DropdownMenu onClick={this.handleSemenCompanySelected}
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
                                  {semenCompanyCodeList.map(animaltypeitem => (
                                  <DropdownItem id={animaltypeitem.lookupValueCode} value={animaltypeitem.lookupValueCode} >{animaltypeitem.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>

                        <FormGroup row style={showExternalSireFields} >
                          <Label sm="3" htmlFor="input-normal">Price PKR (Sexed)</Label>
                          <Col sm="7">
                            <Input id="currentSexListPrice" type="number" maxLength="6" min="0" value={this.state.currentSexListPrice} onChange={this.handleChange} placeholder="0.0"  />
                          </Col>
                        </FormGroup>


                        <FormGroup row style={showExternalSireFields} >
                          <Label sm="3" htmlFor="input-normal">Discount % (Sexed)</Label>
                          <Col sm="7">
                            <Input id="discountSexPercentage" type="number" maxLength="6" min="0" max="100" value={this.state.discountSexPercentage} onChange={this.handleChange} placeholder="0.0"  />
                          </Col>
                        </FormGroup>

                        <FormGroup row style={showExternalSireFields} >
                          <Label sm="3" htmlFor="input-normal">Price PKR (Conv)</Label>
                          <Col sm="7">
                            <Input id="currentConventionalListPrice" type="number" maxLength="6" value={this.state.currentConventionalListPrice} onChange={this.handleChange} placeholder="0.0"  />
                          </Col>
                        </FormGroup>


                        <FormGroup row style={showExternalSireFields} >
                          <Label sm="3" htmlFor="input-normal">Discount % (Conv)</Label>
                          <Col sm="7">
                            <Input id="discountConventionalPercentage" type="number" maxLength="6" value={this.state.discountConventionalPercentage} onChange={this.handleChange} placeholder="0.0"  />
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

export default AddSire;
