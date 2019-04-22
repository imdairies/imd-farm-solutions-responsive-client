import React, { Component, lazy, Suspense } from 'react';

import {
  Button, Card, CardBody, CardFooter, CardHeader, Col, Fade, Form,
  FormGroup, FormText, Input, Row,
  Label,  Dropdown, DropdownToggle, DropdownMenu, Table, DropdownItem,
  Carousel, UncontrolledCarousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

var images = [];

class UpdateAnimal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: new Array(2).fill(false),
      activeIndex: 0,
      invalidAccess: false,
      collapse: true,
      warning: false,
      fadeIn: true,
      items: [],
      eventlist: [],
      isLoaded: false,
      timeout: 300,
      isActive: false,
      eventcode : "" ,
      orgID : "",
      animalTag : "",
      dateOfBirth: "",
      animalStatus: "",
      currentAge : "",
      alias: "",
      frontSideImageURL: "",
      backSideImageURL: "",
      rightSideImageURL:"",
      leftSideImageURL:"",
      longdescription: "",
      activeIndicator : "N" ,
      messageColor: "muted",
      lifecycleStageList: [],
      sireList:[],
      animalSireURL: "",
      eventAdditionalMessage: "Loading events ...",
      genericMessage: "Processing ...",
      eventMessageColor: "muted"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);   
    this.handleLifecycleStage = this.handleLifecycleStage.bind(this); 
    this.handleSireChange = this.handleSireChange.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === images.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? images.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }


  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({animalTag: parsed.animalTag, lifecycleStageList: [], orgID: parsed.orgID, invalidAccess: (parsed.animalTag ? false : true)});

    this.setState({items: [], eventlist: [], isLoaded: false, genericMessage: "Processing...", eventAdditionalMessage: "Loading events ..."}); 
    fetch('http://localhost:8080/imd-farm-management/animals/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "orgID": parsed.orgID,
          "animalTag": parsed.animalTag
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({items: [], isLoaded: true, genericMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({items: responseJson, 
                        animalTag: responseJson[0].animalTag , 
                        animalStatus: responseJson[0].animalStatus, 
                        dateOfBirth: responseJson[0].dateOfBirth.substring(0,10),
                        isDateOfBirthEstimated: responseJson[0].isDateOfBirthEstimated,
                        isActive: responseJson[0].isActive, 
                        isLoaded: true,
                        animalDam: responseJson[0].animalDam,
                        animalSire: responseJson[0].animalSire,
                        animalSireURL: (responseJson[0].isBornThroughAI ? responseJson[0].animalSireURL : '#/animal/update?animalTag=' + responseJson[0].animalSire + '&orgID=' + responseJson[0].orgID),
                        animalSireAlias: responseJson[0].animalSireAlias,
                        currentAge : responseJson[0].currentAge,
                        alias: responseJson[0].alias,
                        frontSideImageURL : (responseJson[0].frontSideImageURL ? responseJson[0].frontSideImageURL : "/assets/img/cow-photos/1.png"),
                        backSideImageURL: (responseJson[0].backSideImageURL ? responseJson[0].backSideImageURL : "/assets/img/cow-photos/2.png"),
                        rightSideImageURL : (responseJson[0].rightSideImageURL ? responseJson[0].rightSideImageURL : "/assets/img/cow-photos/3.png"),
                        leftSideImageURL : (responseJson[0].leftSideImageURL ? responseJson[0].leftSideImageURL : "/assets/img/cow-photos/4.png"),
                        animalType: responseJson[0].animalType,
                        eventAdditionalMessage: (responseJson.length === 1 ? "Edit the desired values and press Search button" : "We expected to receive only one record matching the event code '" + parsed.eventCode + "' but we received " + responseJson.length), messageColor: "muted"});
          if (responseJson.length > 1)
            this.setState({messageColor: "danger"});

        images.push({src:this.state.frontSideImageURL,altText:'',header:'Front View'});
        images.push({src:this.state.backSideImageURL,altText:'',header:'Rear View'});
        images.push({src:this.state.rightSideImageURL,altText:'',header:'Right View'});
        images.push({src:this.state.leftSideImageURL,altText:'',header:'Left View'});

      }
    })
    .catch(error => this.setState({genericMessage: error.toString(), messageColor: "danger"}));

    // retrieve Lifecycle Dropdown values  
    fetch('http://localhost:8080/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "LCYCL",
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({lifecycleStageList: [], isLoaded: true, genericMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({lifecycleStageList: responseJson, isLoaded: true, genericMessage: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({genericMessage: error.toString(), messageColor: "danger"}));

    // retrieve sires
    fetch('http://localhost:8080/imd-farm-management/animals/retrieveaisire', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag":"",
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({sireList: [], isLoaded: true, genericMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({sireList: responseJson, isLoaded: true, genericMessage: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({genericMessage: error.toString(), messageColor: "danger"}));



    // lifecycle event
      this.setState({eventlist: [], isLoaded: false}); 
      fetch('http://localhost:8080/imd-farm-management/animalevent/search', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": parsed.animalTag
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({eventlist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, eventMessageColor: "danger"});
        }
        else {
           this.setState({eventlist: responseJson, isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? responseJson.length + " life time event found" : responseJson.length + " life time events found"), eventMessageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), eventMessageColor: "danger"}));



  }

  handleLifecycleStage(event) {
    this.setState({animalType: event.target.value});
  }


  handleSireChange(event) {
    this.setState({animalSireAlias: this.state.sireList[event.target.value].alias, animalSireURL: this.state.sireList[event.target.value].sireDataSheet});
  }


  handleChange(event) {
    if (event.target.id === "eventcode")
      this.setState({eventcode: event.target.value});
    if (event.target.id === "shortdescription")
      this.setState({shortdescription: event.target.value});
    if (event.target.id === "longdescription")
      this.setState({longdescription: event.target.value});
    if (event.target.id === "active")
      this.setState({activeIndicator: (event.target.checked ? "Y": "N")});
  }

  handleUpdate(event) {
    event.preventDefault();
    alert("Not Implemented");
  }



  render() {
    var { activeIndex, invalidAccess, lifecycleStageList, sireList, eventAdditionalMessage, genericMessage, eventMessageColor, messageColor, items, eventlist} = this.state;
    let recordCount = 0;
    let eventRecordCount = 0;
    if (invalidAccess)
      return (<Redirect to='/animal/search'  />);
    
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" xl="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>Tag # <strong>{this.state.animalTag}</strong>
              </CardHeader>
              <CardBody>
                 <UncontrolledCarousel items={images} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="16">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="8">
                  <Card>
                    <CardHeader><strong>Basic Information</strong></CardHeader>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Alias</Label>
                          <Col sm="4">
                              <Input id="alias" name= "alias" type="text" maxLength="10" value={this.state.alias}  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Date of Birth</Label>
                          <Col sm="3">
                              <Input id="dateOfBirth" type="text" maxLength="10" value={this.state.dateOfBirth} /> 
                          </Col>
                          <Col>
                            <FormText color="danger">{(this.state.isDateOfBirthEstimated ? 'estimated':'') } </FormText>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Age</Label>
                          <Col sm="6">
                              {this.state.currentAge}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Dam</Label>
                          <Col sm="8">
                             <Link target="_blank" rel="noopener noreferrer" to={'/animal/update?animalTag=' + this.state.animalDam + '&orgID=' + this.state.orgID} >{this.state.animalDam}</Link>{this.state.animalDam === "" ? "Unknown" : ""}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Sire</Label>
                          <Col sm="4">
                            <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                              this.toggle(1);}}>
                              <DropdownToggle caret>
                                {this.state.animalSireAlias}
                              </DropdownToggle>
                              <DropdownMenu onClick={this.handleSireChange}>
                                {sireList.map(sire => (<DropdownItem id={sire.animalTag} value={recordCount++}>{sire.alias}</DropdownItem>))}
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                          <Col sm="4">
                            <a target="_blank" rel="noopener noreferrer" href={this.state.animalSireURL}>{this.state.animalSireAlias + '\'s Data Sheet'}</a>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Lifecycle Stage</Label>
                          <Col sm="8">
                            <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                              this.toggle(0);}}>
                              <DropdownToggle caret>
                                {this.state.animalType}
                              </DropdownToggle>

                              <DropdownMenu onClick={this.handleLifecycleStage}>
                                {lifecycleStageList.map(lifecycleStageItem => (
                                <DropdownItem id={lifecycleStageItem.lookupValueCode} value={lifecycleStageItem.lookupValueCode} >{lifecycleStageItem.shortDescription}</DropdownItem>
                             ))}
                              </DropdownMenu>
                            </Dropdown>
                          </Col>

                        </FormGroup>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md="8">
                  <Card>
                    <CardHeader><strong>Lifetime Production Information</strong></CardHeader>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Lifetime Max</Label>
                          <Col sm="8"> 39 liters (3 day average)
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Lifetime Average</Label>
                          <Col sm="8">25 lpd
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="10" htmlFor="input-normal">
                            <a target="_blank" rel="noopener noreferrer" href={"/#/animal/milking/view?orgID=IMD&&animalTag=" + this.state.animalTag}>Click to view lifetime milking information</a>
                          </Label>
                        </FormGroup>
                      </Form>                  
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <Card>
                      <CardHeader>
                      <i className="fa fa-align-justify"></i> Life Events<FormText color={eventMessageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                       <div className="card-header-actions">
                         <Button color="link" className="card-header-action btn-minimize" data-target="#animaldata" ></Button>
                       </div>
                      </CardHeader>
                      <CardBody>
                         <Table hover bordered striped responsive size="sm">
                           <thead>
                              <tr>
                                <th>#</th>
                                <th>Timestamp</th>
                                <th>Type</th>
                                <th>Operator</th>
                                <th>Comments</th>
                                <th>Additional Info</th>
                              </tr> 
                           </thead>
                           <tbody>
                             {eventlist.map(item => (
                                 <tr key="{item.animalTag}">
                                   <td>{eventlist.length - ++eventRecordCount + 1}</td>
                                   <td data-toggle="tooltip" title={item.eventTimeStamp.substring(item.eventTimeStamp.length-8).trim()}>{item.eventTimeStamp.substring(0,item.eventTimeStamp.length-8).trim()}</td>
                                   <td>{item.eventShortDescription}</td>
                                   <td>{item.eventOperator}</td>
                                   <td>{item.eventComments}</td>
                                   <td>{item.auxField1Value}</td>
                               </tr>
                               ))}
                           </tbody>
                         </Table>
                      </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <CardFooter>
                        <FormText color={messageColor}>&nbsp;{genericMessage}</FormText>
                        <Button type="button" size="md" color="primary" onClick={this.handleUpdate}><i className="fa fa-edit"></i>&nbsp;Update</Button>
                      </CardFooter>
                    </CardBody>
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

export default UpdateAnimal;
