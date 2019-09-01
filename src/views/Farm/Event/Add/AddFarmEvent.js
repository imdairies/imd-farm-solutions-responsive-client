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
  Table,
  Row,
  Label,
  Nav, 
  NavItem, 
  InputGroup,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavLink,
  ButtonDropdown
} from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import DateTimePicker from 'react-datetime-picker';

var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';

class AddFarmEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      dropdownOpen: new Array(7).fill(false),
      warning: false,
      fadeIn: true,
      isLoaded: false,
      timeout: 300,
      animalTag: "",
      eventlist: [],
      eventCode: "-- Select Event --",
      eventCodeID: "",
      operatorlist: [],
      operator: "-- Select Operator --",
      operatorID:"",
      alias: "",
      longdescription: "",
      messageColor: "muted",
      timestamp: new Date(),
      eventDate: new Date(),

      field1Label: "",
      field1Value: "",
      field1DropdownDisplayValue: "",
      field1Type: "",
      field1list: [],
      field1DataUnit: "",
      field1TextDisplay : false,
      field1TextAreaDisplay: false,
      field1NumberDisplay : false,
      field1YesNoDisplay : false,

      field2Label: "",
      field2Value: "",
      field2DropdownDisplayValue: "",
      field2DataUnit: "",
      field2list: [],
      field2TextDisplay : false,
      field2TextAreaDisplay: false,
      field2NumberDisplay : false,
      field2YesNoDisplay : false,

      commentsFieldDisplay: false,
      commentsValue: "",

      animalType: "-- Select Animal --",
      animaltypelist: [],
      animalTagList: [],
      selectAll: false,

      eventAdditionalMessage: "Specify desired values and press Add",
      messageColor: "danger",

      animalListMessage: "",
      animalListMessageColor: "",
      selectedCount: 0
    };
    this.handleEventSelected = this.handleEventSelected.bind(this);
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleField1Changed = this.handleField1Changed.bind(this);
    this.handleField2Changed = this.handleField2Changed.bind(this);
    this.handleDateChanged = this.handleDateChanged.bind(this);
    this.handleOperatorSelected = this.handleOperatorSelected.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleAnimalTypeSelected = this.handleAnimalTypeSelected.bind(this);
    this.handleAnimalChecked = this.handleAnimalChecked.bind(this);
    this.toggleSelection = this.toggleSelection.bind(this);
    this.selectOrDeselectAll = this.selectOrDeselectAll.bind(this);
    this.handleCommentsChanged = this.handleCommentsChanged.bind(this);
    this.handleField1DropdownValueChanged = this.handleField1DropdownValueChanged.bind(this);
    this.handleField2DropdownValueChanged = this.handleField2DropdownValueChanged.bind(this);

  }

  toggleSelection(event) {
    let prevValue = this.state.selectAll;
    if (this.state.animalTagList.length === 0) {
      alert("Nothing to select");
    } else {
      this.setState({selectAll: !prevValue});
      this.selectOrDeselectAll(!prevValue);
    }
  }
  handleCommentsChanged(event) {
      this.setState({commentsValue: event.target.value});
  }

  getSelectedTags(){
    let animalTempList = this.state.animalTagList;
    let animalSelectedTags = "";
    let index;
    for (index=0; index<animalTempList.length; index++){
      if (animalTempList[index].checked) {
        if (animalSelectedTags === "")
          animalSelectedTags += animalTempList[index].animalTag;
        else 
          animalSelectedTags += "," + animalTempList[index].animalTag;
      }
    }
    return animalSelectedTags;
  }

handleField1DropdownValueChanged(event) {
    let item = this.state.field1list[event.target.id];
    let dropDownDisplayValue = (item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")";
    this.setState({field1Value: event.target.value,
      field1DropdownDisplayValue: dropDownDisplayValue});
  }
 
  handleField2DropdownValueChanged(event) {
    let item = this.state.field2list[event.target.id];
    let dropDownDisplayValue = (item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")";
    this.setState({field2Value: event.target.value,
      field2DropdownDisplayValue: dropDownDisplayValue});
  }


  selectOrDeselectAll(shouldSelectAll) {
    let animalTempList = this.state.animalTagList;
    let selectedCount = 0;
    let index = 0;
   // alert(shouldSelectAll);
    for (index=0; index<animalTempList.length; index++){
      animalTempList[index].checked = shouldSelectAll;
      if (shouldSelectAll)
        selectedCount++;
    }
    //alert(selectedCount);
    this.setState({animalTagList: animalTempList, selectedCount: selectedCount});
  }

  handleAnimalChecked(event) {
    let animalTagTempList = this.state.animalTagList;
    let selectedCount = 0;
    animalTagTempList[event.target.id].checked = !animalTagTempList[event.target.id].checked;
    // alert(animalTagTempList[event.target.id].checked);
    let index = 0;
    let allSelected = true;
    for (index=0; index<animalTagTempList.length; index++){
      if (!animalTagTempList[index].checked) {
        allSelected = false;
      } else {
        selectedCount++;
      }
    }
    this.setState({animalTagList: animalTagTempList, selectAll: allSelected, selectedCount: selectedCount});
  }

  handleAnimalTypeSelected(event) {
    event.preventDefault();
    this.setState({animalType: event.target.value, selectAll: false, animalTagList: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/animals/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": this.state.animalTag,
          "animalType": (event.target.value === "-- Select Animal --" || event.target.value === "ALL" ? null : event.target.value),
          "activeOnly": true
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({animalTagList: [], isLoaded: true, animalListMessage: responseJson.message, animalListMessageColor: "danger"});
      }
      else {
         this.setState({animalTagList: responseJson, isLoaded: true, animalListMessage: (responseJson.length === 1 ? responseJson.length + " matching record found" : responseJson.length + " matching records found"), animalListMessageColor: "success"});         
      }
    })
    .catch(error => this.setState({animalListMessage: error.toString(), animalListMessageColor: "danger"}));
  }

  handleDateChanged(event) {
      this.setState({eventDate: event.target.value});
  }

  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleTimestampChanged(newValue) {
    this.setState({timestamp: newValue});
  }
  handleField1Changed(event) {
    this.setState({field1Value: event.target.value});
  }
  handleField2Changed(event) {
    // alert(event.target.value);
    this.setState({field2Value: event.target.value});
  }

  componentDidMount() {

    // retrieve animal typelist
    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "LCYCL",
          "activeIndicator": "Y"
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({animaltypelist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({animaltypelist: responseJson, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));


    // retrieve Event Dropdown values  
    fetch(API_PREFIX + '/imd-farm-management/lv-lifecycle-event/allactive')
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({eventlist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {     
         this.setState({eventlist: responseJson, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});   
         //alert(this.state.eventlist.length);      
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));


    // retrieve Operator Dropdown values  
    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "OPRTR",
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({operatorlist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({operatorlist: responseJson, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));


   }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  handleAnimalTagChanged(event) {
    this.setState({animalTag: event.target.value});
  }
  handleOperatorSelected(event) {
    this.setState({operator: event.target.value, operatorID: event.target.id});
  }

  handleEventSelected(event) {

    this.setState({field1Value: "", field2Value: "", field1DropdownDisplayValue: "", field2DropdownDisplayValue: ""});

    let arrayIndex = event.target.id
    let eventCode = this.state.eventlist[arrayIndex].eventCode;

    let field1Label = this.state.eventlist[arrayIndex].eventField1Label;
    let field1DataType = this.state.eventlist[arrayIndex].eventField1DataType;
    let field1DataUnit = this.state.eventlist[arrayIndex].eventField1DataUnit;

    let field2Label = this.state.eventlist[arrayIndex].eventField2Label;
    let field2DataType = this.state.eventlist[arrayIndex].eventField2DataType;
    let field2DataUnit = this.state.eventlist[arrayIndex].eventField2DataUnit;

    let nextLifecycleStageList = this.state.eventlist[arrayIndex].nextLifecycleStage;

    let messageColor = "";
    let eventAdditionalMessage = "";
    let apiUrlPostfix = "";


    let field1TextDisplay = false;
    let field1TextAreaDisplay = false;
    let field1NumberDisplay = false;
    let field1YesNoDisplay = false;
    let field1DropdownDisplay = false;

    let field2TextDisplay = false;
    let field2TextAreaDisplay = false;
    let field2NumberDisplay = false;
    let field2YesNoDisplay = false;
    let field2DropdownDisplay = false;


    if (field1DataType === "TEXT")
      field1TextDisplay = true;
    else if (field1DataType === "TEXTAREA")
      field1TextAreaDisplay = true;
    else if (field1DataType === "FLOAT")
      field1NumberDisplay = true;
    else if (field1DataType === "YESNO")
      field1YesNoDisplay = true;
    else if (field1DataType.indexOf("LV:") == 0) {
      // dropdown data type.
      field1DropdownDisplay = true;
      apiUrlPostfix =  field1DataType.substring(3);
      fetch(API_PREFIX + '/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix, {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": "%"
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({field1list:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({field1list: responseJson, isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field1DataType === "CATEGORY_CD") {
      field1DropdownDisplay = true;
      fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          "categoryCode": field1DataUnit,
          "lookupValueCode": "%"
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({field1list:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({field1list: responseJson, isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field1DataType !== "") {
      field1TextDisplay = true;      
    }


    if (field2DataType === "TEXT")
      field2TextDisplay = true;
    else if (field2DataType === "TEXTAREA")
      field2TextAreaDisplay = true;
    else if (field2DataType === "FLOAT")
      field2NumberDisplay = true;
    else if (field2DataType === "YESNO")
      field2YesNoDisplay = true;
    else if (field2DataType.indexOf("LV:") == 0) {
      // dropdown data type.
      field2DropdownDisplay = true;
      apiUrlPostfix =  field2DataType.substring(3);
      // alert(API_PREFIX + '/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix);

      fetch(API_PREFIX + '/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix, {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": "%"
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({field2list:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({field2list: responseJson, isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field2DataType === "CATEGORY_CD") {
      field2DropdownDisplay = true;
      fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          "categoryCode": field2DataUnit,
          "lookupValueCode": "%"
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({field2list:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({field2list: responseJson, isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field2DataType !== "") {
      // unknown datatype, probably because this data type is not yet implemented
      field2TextDisplay = true;
    }

    // if (field1Label === "" && field2Label === "") {
    //   messageColor = "danger";
    //   eventAdditionalMessage = "It seems that the selected event has not been configured properly. Please contact your administrator";
    // }

    this.setState({eventCode: event.target.value, 
      field1Display: (field1Label !== ""), 
      field2Display: (field2Label !== ""),
      commentsFieldDisplay:true,

      messageColor: messageColor,
      eventAdditionalMessage: eventAdditionalMessage,
      eventCodeID: eventCode, 

      field1Label: field1Label,
      field1DataUnit: field1DataUnit,

      field1TextDisplay : field1TextDisplay,
      field1TextAreaDisplay : field1TextAreaDisplay,
      field1NumberDisplay : field1NumberDisplay,
      field1YesNoDisplay : field1YesNoDisplay,
      field1DropdownDisplay: field1DropdownDisplay,

      field2TextDisplay : field2TextDisplay,
      field2TextAreaDisplay: field2TextAreaDisplay,
      field2NumberDisplay : field2NumberDisplay,
      field2YesNoDisplay : field2YesNoDisplay,
      field2DropdownDisplay: field2DropdownDisplay,

      field2Label: field2Label,
      field2DataUnit: field2DataUnit,
      nextLifecycleStageList: nextLifecycleStageList,
      nextLifecycleStageDisplay: (nextLifecycleStageList.length > 0)
    });
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

    if (this.state.eventCode.length === 0 || this.state.eventCode === "-- Select Event --") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please select an Event"});
    } else if (this.state.field1Label !== "" && this.state.field1Value === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field1Label});
    } else if (this.state.field2Label !== "" && this.state.field2Value === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field2Label});
    } else {
      this.setState({eventAdditionalMessage: "Processing ..."
      });
      fetch(API_PREFIX + '/imd-farm-management/animalevent/addbatch', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": this.getSelectedTags(),
            "eventCode": this.state.eventCodeID,
            "eventTimeStamp": this.state.timestamp.toLocaleString(),
            "eventComments": this.state.commentsValue,
            "auxField1Value": this.state.field1Value,
            "auxField2Value": this.state.field2Value,
            "operatorID": this.state.operatorID
            // "eventLongDescription": longDescr,
            // "activeIndicator": active
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
          if (responseJson.message.indexOf("ERROR") >= 0)
           this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "warning"});
          else
           this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    }
  }

  render() {

    var { animaltypelist, animalListMessageColor, animalListMessage,field1list, field2list, nextLifecycleStageList, eventAdditionalMessage, messageColor, animalTagList, eventlist, operatorlist} = this.state;
    let eventCount = 0;
    let field1Count = 0;
    let field2Count = 0;

    let field1TextDisplay = this.state.field1TextDisplay ? {} : {display : 'none'};
    let field1TextAreaDisplay = this.state.field1TextAreaDisplay ? {} : {display : 'none'};
    let field1NumberDisplay = this.state.field1NumberDisplay ? {} : {display : 'none'};
    let field1YesNoDisplay  = this.state.field1YesNoDisplay ? {} : {display : 'none'};
    let field1DropdownDisplay = this.state.field1DropdownDisplay ? {} : {display : 'none'};

    let field2TextDisplay  = this.state.field2TextDisplay ? {} : {display : 'none'};
    let field2TextAreaDisplay = this.state.field2TextAreaDisplay ? {} : {display : 'none'};
    let field2NumberDisplay  = this.state.field2NumberDisplay ? {} : {display : 'none'};
    let field2YesNoDisplay  = this.state.field2YesNoDisplay ? {} : {display : 'none'};
    let field2DropdownDisplay = this.state.field2DropdownDisplay ? {} : {display : 'none'};

    let commentsFieldDisplay  = this.state.commentsFieldDisplay ? {} : {display : 'none'};
    
    let animalIndex = 0;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="8">
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i><strong>Event Selection</strong>
                    </CardHeader>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Event</Label>
                          <Col sm="8">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.eventCode}
                                </DropdownToggle>

                                <DropdownMenu id="eventCode" onClick={this.handleEventSelected}>
                                  {eventlist.map(item => (
                                  <DropdownItem id={eventCount++} value={item.eventShortDescription} >{item.eventShortDescription}</DropdownItem>
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
                          <Label sm="4" htmlFor="input-normal">Operator</Label>
                          <Col sm="8">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[2]} toggle={() => {
                                this.toggle(2);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.operator}
                                </DropdownToggle>

                                <DropdownMenu id="lookupValueCode" onClick={this.handleOperatorSelected}>
                                  {operatorlist.map(item => (
                                  <DropdownItem id={item.lookupValueCode} value={item.shortDescription} >{item.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                        </FormGroup>


                        <FormGroup row style={field1TextAreaDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field1Label}</Label>
                          <Col sm="6">
                            <Input id="field1" type="textarea" name={this.state.field1Label} rows="3" value={this.state.field1Value} onChange={this.handleField1Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field1DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field1TextDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field1Label}</Label>
                          <Col sm="6">
                            <Input id="field1" type="text" name={this.state.field1Label} value={this.state.field1Value} onChange={this.handleField1Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field1DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field1NumberDisplay} >
                          <Label sm="4" htmlFor="input-normal"  >{this.state.field1Label}</Label>
                          <Col sm="6">
                            <Input id="field1" type="Number" name={this.state.field1Label} value={this.state.field1Value} onChange={this.handleField1Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field1DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field1YesNoDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field1Label}</Label>
                          <Col sm="6">
                            <Dropdown  isOpen={this.state.dropdownOpen[3]} toggle={() => {
                              this.toggle(3);}}>
                              <DropdownToggle caret>{this.state.field1Value}</DropdownToggle>
                              <DropdownMenu id="field1" onClick={this.handleField1Changed}>
                                <DropdownItem id="field1_YES" value="YES">Yes</DropdownItem>
                                <DropdownItem id="field1_NO" value="NO">No</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                          <Col sm="2">
                            {this.state.field1DataUnit}
                          </Col>
                        </FormGroup>

                        <FormGroup row style={field1DropdownDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field1Label}</Label>
                          <Col sm="6">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[4]} toggle={() => {
                                this.toggle(4);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.field1DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field1" onClick={this.handleField1DropdownValueChanged}>
                                  {field1list.map(item => (
                                  <DropdownItem id={field1Count++} value={(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode : "")} >{(item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")"}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                          <Col sm="2">
                            {this.state.field1DataUnit}
                          </Col>
                        </FormGroup>
  


                        <FormGroup row style={field2TextAreaDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field2Label}</Label>
                          <Col sm="6">
                            <Input id="field2" type="textarea" name={this.state.field2Label} rows="2" value={this.state.field2Value} onChange={this.handleField2Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field2DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field2TextDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field2Label}</Label>
                          <Col sm="6">
                            <Input id="field2" type="text"  name={this.state.field2Label} value={this.state.field2Value} onChange={this.handleField2Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field2DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field2NumberDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field2Label}</Label>
                          <Col sm="6">
                            <Input id="field2" type="Number" name={this.state.field2Label} rows="3" value={this.state.field2Value} onChange={this.handleField2Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field2DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field2YesNoDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field2Label}</Label>
                          <Col sm="6">
                            <Dropdown isOpen={this.state.dropdownOpen[5]} toggle={() => {
                              this.toggle(5);}}>
                              <DropdownToggle caret>{this.state.field2Value}</DropdownToggle>
                              <DropdownMenu id="field2" onClick={this.handleField2Changed}>
                                <DropdownItem id="field2_YES" value="YES">Yes</DropdownItem>
                                <DropdownItem id="field2_NO" value="NO">No</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                          <Col sm="2">
                            {this.state.field1DataUnit}
                          </Col>
                        </FormGroup>

                        <FormGroup row style={field2DropdownDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field2Label}</Label>
                          <Col sm="6">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[6]} toggle={() => {
                                this.toggle(6);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.field2DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field2" onClick={this.handleField2DropdownValueChanged}>
                                  {field2list.map(item => (
                                  <DropdownItem id={field2Count++} value={(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode : "")} >{(item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")"}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                          <Col sm="2">
                            {this.state.field2DataUnit}
                          </Col>
                        </FormGroup>

                        <FormGroup row style={commentsFieldDisplay} >
                          <Label sm="4" htmlFor="input-normal" >Comments</Label>
                          <Col sm="6">
                            <Input id="field2" type="textarea" name="comments" rows="2" value={this.state.commentsValue} onChange={this.handleCommentsChanged} />
                          </Col>
                        </FormGroup>



                      </Form>
                    </CardBody>
                  </Card>
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i><strong>Animal Selection</strong>
                  </CardHeader>
                  <CardBody>
                    <FormText color={animalListMessageColor}>&nbsp;{animalListMessage}</FormText>
                    <FormGroup row>
                      <Label sm="4" htmlFor="input-normal">Animal Selection</Label>
                      <Col>
                        <InputGroup>
                          <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                            this.toggle(0);
                          }}>
                            <DropdownToggle caret>
                              {this.state.animalType}
                            </DropdownToggle>

                            <DropdownMenu onClick={this.handleAnimalTypeSelected}>
                              <DropdownItem id="ALL" value="ALL" >ALL</DropdownItem>
                              {animaltypelist.map(animaltypeitem => (
                              <DropdownItem id={animaltypeitem.lookupValueCode} value={animaltypeitem.lookupValueCode} >{animaltypeitem.shortDescription}</DropdownItem>
                           ))}
                              </DropdownMenu>
                            </Dropdown>
                        </InputGroup>
                      </Col>
                    </FormGroup>
                     <Table hover bordered striped responsive size="md">
                       <thead>
                          <tr>
                            <th>&nbsp;&nbsp;&nbsp;&nbsp;
                              <Input typeclassName="form-check-input" type="checkbox" checked={this.state.selectAll} name="selectionChk" onClick={this.toggleSelection} />Select {"(" + this.state.selectedCount + ")"}
                            </th>
                            <th>Tag#</th>
                            <th>Type</th>
                            <th>Age</th>
                          </tr> 
                       </thead>
                       <tbody>
                         {animalTagList.map(item => (
                             <tr key="{item.animalTag}">
                               <td align="center"><Input typeclassName="form-check-input" type="checkbox" checked={item.checked} id={animalIndex++} name={"chbx_" + item.animalTag} value={item.animalTag}  onClick={this.handleAnimalChecked} /></td>
                               <td><Link to={'/animal/update?animalTag=' + item.animalTag + '&orgID=' + item.orgID} >{item.animalTag}</Link></td>
                               <td>{item.animalType}</td>
                               <td>{item.currentAge}</td>
                           </tr>
                           ))}
                       </tbody>
                     </Table>
                    </CardBody>
                  <CardFooter>
                    <Button type="button" size="md" color="primary" onClick={this.handleAdd}><i className="fa fa-plus"></i>{' '}Add Event</Button>
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

export default AddFarmEvent;
