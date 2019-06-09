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


class AddAnimalEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      dropdownOpen: new Array(12).fill(false),
      warning: false,
      fadeIn: true,
      isLoaded: false,
      timeout: 300,
      animaltaglist: [],
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

      field3Label: "",
      field3Value: "",
      field3DropdownDisplayValue: "",
      field3DataUnit: "",
      field3list: [],
      field3TextDisplay : false,
      field3TextAreaDisplay: false,
      field3NumberDisplay : false,
      field3YesNoDisplay : false,

      field4Label: "",
      field4Value: "",
      field4DropdownDisplayValue: "",
      field4DataUnit: "",
      field4list: [],
      field4TextDisplay : false,
      field4TextAreaDisplay: false,
      field4NumberDisplay : false,
      field4YesNoDisplay : false,

      inventoryUpdateLabel: "",
      shouldUpdateInventoryValue: "",

      commentsFieldDisplay: false,
      commentsValue: "",

      nextLifecycleStageList: [],
      nextLifecycleStageDisplay: false,
      nextLifecycleStageValue: "--Select Next Lifecycle Stage--",

      eventAdditionalMessage: "Specify desired values and press Add"
    };
    this.handleAnimalTagChanged = this.handleAnimalTagChanged.bind(this);
    this.handleEventSelected = this.handleEventSelected.bind(this);
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleField1Changed = this.handleField1Changed.bind(this);
    this.handleField2Changed = this.handleField2Changed.bind(this);
    this.handleField3Changed = this.handleField3Changed.bind(this);
    this.handleField4Changed = this.handleField4Changed.bind(this);
    this.handleDateChanged = this.handleDateChanged.bind(this);
    this.handleOperatorSelected = this.handleOperatorSelected.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this); 
    this.handleCommentsChanged = this.handleCommentsChanged.bind(this);
    this.handleLifecycleStageValueChanged = this.handleLifecycleStageValueChanged.bind(this);
    this.handleField1DropdownValueChanged = this.handleField1DropdownValueChanged.bind(this);
    this.handleField2DropdownValueChanged = this.handleField2DropdownValueChanged.bind(this);
    this.handleField3DropdownValueChanged = this.handleField3DropdownValueChanged.bind(this);
    this.handleField4DropdownValueChanged = this.handleField4DropdownValueChanged.bind(this);
    this.handleShouldUpdateInventoryChanged = this.handleShouldUpdateInventoryChanged.bind(this);

  }

  handleLifecycleStageValueChanged(event){
      this.setState({nextLifecycleStageValue: event.target.value});
  }
 
  handleCommentsChanged(event) {
      this.setState({commentsValue: event.target.value});
  }
  handleShouldUpdateInventoryChanged(event) {
      this.setState({shouldUpdateInventoryValue: event.target.value});
  }

  handleDateChanged(event) {
      this.setState({eventDate: event.target.value});
  }

  handleTabClick(targetID) {
  }

  handleTimestampChanged(newValue) {
    this.setState({timestamp: newValue});
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
  handleField3DropdownValueChanged(event) {
    let item = this.state.field3list[event.target.id];
    let dropDownDisplayValue = (item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")";
    this.setState({field3Value: event.target.value,
      field3DropdownDisplayValue: dropDownDisplayValue});
  }
  handleField4DropdownValueChanged(event) {
    let item = this.state.field4list[event.target.id];
    let dropDownDisplayValue = (item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")";
    this.setState({field4Value: event.target.value,
      field4DropdownDisplayValue: dropDownDisplayValue});
  }

  handleField1Changed(event) {
    this.setState({field1Value: event.target.value});
  }
 
  handleField2Changed(event) {
    this.setState({field2Value: event.target.value});
  }
  handleField3Changed(event) {
    // alert(event.target.value);
    this.setState({field3Value: event.target.value});
  }
  handleField4Changed(event) {
    this.setState({field4Value: event.target.value});
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({lookupValueCode: parsed.lookupValueCode, animaltaglist: [], eventlist: [], operatorlist: [], isLoaded: false}); 


    // retrieve Event Dropdown values  
    fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event/allactive')
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
    fetch('http://localhost:8080/imd-farm-management/lookupvalues/search', {
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

    let field3Label = this.state.eventlist[arrayIndex].eventField3Label;
    let field3DataType = this.state.eventlist[arrayIndex].eventField3DataType;
    let field3DataUnit = this.state.eventlist[arrayIndex].eventField3DataUnit;

    let field4Label = this.state.eventlist[arrayIndex].eventField4Label;
    let field4DataType = this.state.eventlist[arrayIndex].eventField4DataType;
    let field4DataUnit = this.state.eventlist[arrayIndex].eventField4DataUnit;

    let nextLifecycleStageList = this.state.eventlist[arrayIndex].nextLifecycleStage;

    let inventoryUpdateLabel = this.state.eventlist[arrayIndex].inventoryUpdateLabel;

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

    let field3TextDisplay = false;
    let field3TextAreaDisplay = false;
    let field3NumberDisplay = false;
    let field3YesNoDisplay = false;
    let field3DropdownDisplay = false;

    let field4TextDisplay = false;
    let field4TextAreaDisplay = false;
    let field4NumberDisplay = false;
    let field4YesNoDisplay = false;
    let field4DropdownDisplay = false;


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
      fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix, {
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
      fetch('http://localhost:8080/imd-farm-management/lookupvalues/search', {
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
      // alert('http://localhost:8080/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix);

      fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix, {
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
      fetch('http://localhost:8080/imd-farm-management/lookupvalues/search', {
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





    if (field3DataType === "TEXT")
      field3TextDisplay = true;
    else if (field3DataType === "TEXTAREA")
      field3TextAreaDisplay = true;
    else if (field3DataType === "FLOAT")
      field3NumberDisplay = true;
    else if (field3DataType === "YESNO")
      field3YesNoDisplay = true;
    else if (field3DataType.indexOf("LV:") == 0) {
      // dropdown data type.
      field3DropdownDisplay = true;
      apiUrlPostfix =  field3DataType.substring(3);
      // alert('http://localhost:8080/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix);

      fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix, {
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
           this.setState({field3list:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({field3list: responseJson, isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field3DataType === "CATEGORY_CD") {
      field3DropdownDisplay = true;
      fetch('http://localhost:8080/imd-farm-management/lookupvalues/search', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          "categoryCode": field3DataUnit,
          "lookupValueCode": "%"
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({field3list:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({field3list: responseJson, isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field3DataType !== "") {
      // unknown datatype, probably because this data type is not yet implemented
      field3TextDisplay = true;
    }



  if (field4DataType === "TEXT")
      field4TextDisplay = true;
    else if (field4DataType === "TEXTAREA")
      field4TextAreaDisplay = true;
    else if (field4DataType === "FLOAT")
      field4NumberDisplay = true;
    else if (field4DataType === "YESNO")
      field4YesNoDisplay = true;
    else if (field4DataType.indexOf("LV:") == 0) {
      // dropdown data type.
      field4DropdownDisplay = true;
      apiUrlPostfix =  field4DataType.substring(3);
      // alert('http://localhost:8080/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix);

      fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event' + apiUrlPostfix, {
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
           this.setState({field4list:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({field4list: responseJson, isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field4DataType === "CATEGORY_CD") {
      field4DropdownDisplay = true;
      fetch('http://localhost:8080/imd-farm-management/lookupvalues/search', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          "categoryCode": field4DataUnit,
          "lookupValueCode": "%"
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({field4list:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({field4list: responseJson, isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field4DataType !== "") {
      // unknown datatype, probably because this data type is not yet implemented
      field4TextDisplay = true;
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

      field3TextDisplay : field3TextDisplay,
      field3TextAreaDisplay: field3TextAreaDisplay,
      field3NumberDisplay : field3NumberDisplay,
      field3YesNoDisplay : field3YesNoDisplay,
      field3DropdownDisplay: field3DropdownDisplay,
      field3Label: field3Label,
      field3DataUnit: field3DataUnit,

      field4TextDisplay : field4TextDisplay,
      field4TextAreaDisplay: field4TextAreaDisplay,
      field4NumberDisplay : field4NumberDisplay,
      field4YesNoDisplay : field4YesNoDisplay,
      field4DropdownDisplay: field4DropdownDisplay,
      field4Label: field4Label,
      field4DataUnit: field4DataUnit,

      inventoryUpdateLabel: inventoryUpdateLabel,

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
    let mustEnterComments = true;

    if (this.state.animalTag.length === 0) {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please specify an Animal Tag"});
      document.getElementById("animalTag").focus();
    } else if (this.state.eventCode.length === 0 || this.state.eventCode === "-- Select Event --") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please select an Event"});
    } else if (this.state.field1Label !== "" && this.state.field1Value === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field1Label});
    } else if (this.state.field2Label !== "" && this.state.field2Value === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field2Label});
    } else if (this.state.field3Label !== "" && this.state.field3Value === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field3Label});
    } else if (this.state.field4Label !== "" && this.state.field4Value === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field4Label});
    } else if (mustEnterComments && this.state.commentsValue === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter Comments"});
    } else if (this.state.inventoryUpdateLabel !== "" && this.state.shouldUpdateInventoryValue === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please specify \"" + this.state.inventoryUpdateLabel + "\""});
    } else {
      this.setState({eventAdditionalMessage: "Processing ..."
      });
      fetch('http://localhost:8080/imd-farm-management/animalevent/add', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": this.state.animalTag,
            "eventCode": this.state.eventCodeID,
            "eventTimeStamp": this.state.timestamp.toLocaleString(),
            "shouldUpdateInventory": this.state.shouldUpdateInventoryValue,
            "eventComments": this.state.commentsValue,
            "auxField1Value": this.state.field1Value,
            "auxField2Value": this.state.field2Value,
            "auxField3Value": this.state.field3Value,
            "auxField4Value": this.state.field4Value,
            "nextLifeCycleStage": (this.state.nextLifecycleStageValue === "--Select Next Lifecycle Stage--" ? "":this.state.nextLifecycleStageValue),
            "operatorID": this.state.operatorID
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    }
  }

  render() {
    var { field1list, field2list,field3list,field4list, nextLifecycleStageList, eventAdditionalMessage, messageColor, animaltaglist, eventlist, operatorlist} = this.state;
    let eventCount = 0;
    let field1Count = 0;
    let field2Count = 0;
    let field3Count = 0;
    let field4Count = 0;

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


    let field3TextDisplay  = this.state.field3TextDisplay ? {} : {display : 'none'};
    let field3TextAreaDisplay = this.state.field3TextAreaDisplay ? {} : {display : 'none'};
    let field3NumberDisplay  = this.state.field3NumberDisplay ? {} : {display : 'none'};
    let field3YesNoDisplay  = this.state.field3YesNoDisplay ? {} : {display : 'none'};
    let field3DropdownDisplay = this.state.field3DropdownDisplay ? {} : {display : 'none'};


    let field4TextDisplay  = this.state.field4TextDisplay ? {} : {display : 'none'};
    let field4TextAreaDisplay = this.state.field4TextAreaDisplay ? {} : {display : 'none'};
    let field4NumberDisplay  = this.state.field4NumberDisplay ? {} : {display : 'none'};
    let field4YesNoDisplay  = this.state.field4YesNoDisplay ? {} : {display : 'none'};
    let field4DropdownDisplay = this.state.field4DropdownDisplay ? {} : {display : 'none'};

    let commentsFieldDisplay  = this.state.commentsFieldDisplay ? {} : {display : 'none'};

    let shouldUpdateInventoryDisplay = this.state.inventoryUpdateLabel ? {} : {display : 'none'};

    let nextLifecycleStageDisplay = (this.state.nextLifecycleStageDisplay ? {} : {display : 'none'});

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="8">
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i><strong>Animal Event Maintenance</strong>
                    </CardHeader>
                    <CardBody>
                      <Nav tabs>
                        <NavItem>
                          <NavLink id="search-tab"
                            onClick={this.handleTabClick("search-tab")}>
                             <Link to={'/animal/event/search'}><i className="fa fa-search"></i>{' '}</Link><strong>Search</strong>
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
                          <Col lg ="3">
                            <InputGroup>
                              <Input id="animalTag" type="text" maxLength="10" value={this.state.animalTag} onChange={this.handleAnimalTagChanged} placeholder="Animal Tag"/>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Event</Label>
                          <Col sm="8">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
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
                              <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
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
                            <Dropdown  isOpen={this.state.dropdownOpen[2]} toggle={() => {
                              this.toggle(2);}}>
                              <DropdownToggle caret>{this.state.field1Value}</DropdownToggle>
                              <DropdownMenu id="field1" onClick={this.handleField1Changed}>
                                <DropdownItem id="field1_YES" value="YES">Yes</DropdownItem>
                                <DropdownItem id="field1_NO" value="NO">No</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                          <Col sm="2">
                            &nbsp;
                          </Col>
                        </FormGroup>

                        <FormGroup row style={field1DropdownDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field1Label}</Label>
                          <Col sm="6">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[3]} toggle={() => {
                                this.toggle(3);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.field1DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field1" onClick={this.handleField1DropdownValueChanged}>
                                  {field1list.map(item => (
                                  <DropdownItem id={field1Count++} value={(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode : "")} >{(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + " " + (item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") }</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                          <Col sm="2">
                            &nbsp;
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
                            <Dropdown isOpen={this.state.dropdownOpen[4]} toggle={() => {
                              this.toggle(4);}}>
                              <DropdownToggle caret>{this.state.field2Value}</DropdownToggle>
                              <DropdownMenu id="field2" onClick={this.handleField2Changed}>
                                <DropdownItem id="field2_YES" value="YES">Yes</DropdownItem>
                                <DropdownItem id="field2_NO" value="NO">No</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                          <Col sm="2">
                            &nbsp;
                          </Col>
                        </FormGroup>

                        <FormGroup row style={field2DropdownDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field2Label}</Label>
                          <Col sm="6">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[5]} toggle={() => {
                                this.toggle(5);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.field2DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field2" onClick={this.handleField2DropdownValueChanged}>
                                  {field2list.map(item => (
                                  <DropdownItem id={field2Count++} value={(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode : "")} >{(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + " " + (item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "")}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                          <Col sm="2">
                            &nbsp;
                          </Col>
                        </FormGroup>







                        <FormGroup row style={field3TextAreaDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field3Label}</Label>
                          <Col sm="6">
                            <Input id="field3" type="textarea" name={this.state.field3Label} rows="2" value={this.state.field3Value} onChange={this.handleField3Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field3DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field3TextDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field3Label}</Label>
                          <Col sm="6">
                            <Input id="field3" type="text"  name={this.state.field3Label} value={this.state.field3Value} onChange={this.handleField3Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field3DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field3NumberDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field3Label}</Label>
                          <Col sm="6">
                            <Input id="field3" type="Number" name={this.state.field3Label} rows="3" value={this.state.field3Value} onChange={this.handleField3Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field3DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field3YesNoDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field3Label}</Label>
                          <Col sm="6">
                            <Dropdown isOpen={this.state.dropdownOpen[6]} toggle={() => {
                              this.toggle(6);}}>
                              <DropdownToggle caret>{this.state.field3Value}</DropdownToggle>
                              <DropdownMenu id="field3" onClick={this.handleField3Changed}>
                                <DropdownItem id="field3_YES" value="YES">Yes</DropdownItem>
                                <DropdownItem id="field3_NO" value="NO">No</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                          <Col sm="2">
                            &nbsp;
                          </Col>
                        </FormGroup>

                        <FormGroup row style={field3DropdownDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field3Label}</Label>
                          <Col sm="6">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[7]} toggle={() => {
                                this.toggle(7);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.field3DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field3" onClick={this.handleField3DropdownValueChanged}>
                                  {field3list.map(item => (
                                  <DropdownItem id={field3Count++} value={(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode : "")} >{(item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")"}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                          <Col sm="2">
                            &nbsp;
                          </Col>
                        </FormGroup>





                        <FormGroup row style={field4TextAreaDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field4Label}</Label>
                          <Col sm="6">
                            <Input id="field4" type="textarea" name={this.state.field4Label} rows="2" value={this.state.field4Value} onChange={this.handleField4Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field4DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field4TextDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field4Label}</Label>
                          <Col sm="6">
                            <Input id="field4" type="text"  name={this.state.field4Label} value={this.state.field4Value} onChange={this.handleField4Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field4DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field4NumberDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field4Label}</Label>
                          <Col sm="6">
                            <Input id="field4" type="Number" name={this.state.field4Label} rows="3" value={this.state.field4Value} onChange={this.handleField4Changed} />
                          </Col>
                          <Col sm="2">
                            {this.state.field4DataUnit}
                          </Col>
                        </FormGroup>
                        <FormGroup row style={field4YesNoDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field4Label}</Label>
                          <Col sm="6">
                            <Dropdown isOpen={this.state.dropdownOpen[8]} toggle={() => {
                              this.toggle(8);}}>
                              <DropdownToggle caret>{this.state.field4Value}</DropdownToggle>
                              <DropdownMenu id="field4" onClick={this.handleField4Changed}>
                                <DropdownItem id="field4_YES" value="YES">Yes</DropdownItem>
                                <DropdownItem id="field4_NO" value="NO">No</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                          <Col sm="2">
                            &nbsp;
                          </Col>
                        </FormGroup>

                        <FormGroup row style={field4DropdownDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.field4Label}</Label>
                          <Col sm="6">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[9]} toggle={() => {
                                this.toggle(9);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.field4DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field4" onClick={this.handleField4DropdownValueChanged}>
                                  {field4list.map(item => (
                                  <DropdownItem id={field4Count++} value={(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode : "")} >{(item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")"}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown> 
                            </InputGroup>
                          </Col>
                          <Col sm="2">
                            &nbsp;
                          </Col>
                        </FormGroup>

                        <FormGroup row style={commentsFieldDisplay} >
                          <Label sm="4" htmlFor="input-normal" >Comments</Label>
                          <Col sm="6">
                            <Input id="eventComments" type="textarea" name="comments" rows="2" value={this.state.commentsValue} onChange={this.handleCommentsChanged} />
                          </Col>
                        </FormGroup>

                        <FormGroup row style={shouldUpdateInventoryDisplay} >
                          <Label sm="4" htmlFor="input-normal" >{this.state.inventoryUpdateLabel}</Label>
                          <Col sm="6">
                            <Dropdown isOpen={this.state.dropdownOpen[11]} toggle={() => {
                              this.toggle(11);}}>
                              <DropdownToggle caret>{this.state.shouldUpdateInventoryValue}</DropdownToggle>
                              <DropdownMenu id="inventoryUpdateLabel" onClick={this.handleShouldUpdateInventoryChanged}>
                                <DropdownItem id="inventoryUpdateLabel_YES" value="YES">Yes</DropdownItem>
                                <DropdownItem id="inventoryUpdateLabel_NO" value="NO">No</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                        </FormGroup>


                        <FormGroup row style={nextLifecycleStageDisplay} >
                          <Label sm="4" htmlFor="input-normal" >Next Stages:</Label>
                          <Col sm="6">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[10]} toggle={() => {
                                this.toggle(10);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.nextLifecycleStageValue}
                                </DropdownToggle>
                              <DropdownMenu id="field2" onClick={this.handleLifecycleStageValueChanged}>
                                  {nextLifecycleStageList.map(item => (
                                  <DropdownItem id={field2Count++} value={item} >{item}</DropdownItem>
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

export default AddAnimalEvent;
