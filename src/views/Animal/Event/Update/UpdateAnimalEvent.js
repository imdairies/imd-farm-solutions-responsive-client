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
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,  
  Row,
  Label,
  Nav, 
  NavItem, 
  NavLink   
} from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import DateTimePicker from 'react-datetime-picker';



class UpdateAnimalEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: new Array(9).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      items: [],
      operatorlist: [],
      eventOperator: "-- Select Operator --",
      isLoaded: false,
      timeout: 300,
      animalTag : "Loading..." ,
      eventCode: "Loading...",
      alias: "",
      timestamp: new Date(),
      eventComments: "",
      eventCodeID: "",
      eventTransactionID: "",


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

      commentsFieldDisplay: false,


      messageColor: "muted",
      eventAdditionalMessage: "Specify desired values and press Add"
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);  
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleField1Changed = this.handleField1Changed.bind(this);
    this.handleField2Changed = this.handleField2Changed.bind(this);
    this.handleField3Changed = this.handleField3Changed.bind(this);
    this.handleField4Changed = this.handleField4Changed.bind(this);
    this.handleOperatorSelected = this.handleOperatorSelected.bind(this);
    this.handleEventSelected = this.handleEventSelected.bind(this);
    this.handleCommentsChanged = this.handleCommentsChanged.bind(this);
    this.showHideFields = this.showHideFields.bind(this);
    this.handleField1DropdownValueChanged = this.handleField1DropdownValueChanged.bind(this);
    this.handleField2DropdownValueChanged = this.handleField2DropdownValueChanged.bind(this);
    this.handleField3DropdownValueChanged = this.handleField3DropdownValueChanged.bind(this);
    this.handleField4DropdownValueChanged = this.handleField4DropdownValueChanged.bind(this);
    this.hideEverything = this.hideEverything.bind(this);
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({eventTransactionID: parsed.eventTransactionID, animaltaglist: [], operatorlist: [], isLoaded: false}); 


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


    fetch('http://localhost:8080/imd-farm-management/animalevent/retrieveoneevent', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "eventTransactionID": parsed.eventTransactionID
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({animalTag: "", isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({animalTag: responseJson[0].animalTag, 
          eventCode: responseJson[0].eventShortDescription, 
          eventCodeID: responseJson[0].eventCode,
          eventComments: responseJson[0].eventComments,
          
          field1Label: responseJson[0].eventField1Label,
          field1Value: responseJson[0].auxField1Value,
          field1DataUnit:responseJson[0].eventField1DataUnit,
          field1DataType: responseJson[0].eventField1DataType,
          field1DropdownDisplayValue: responseJson[0].auxField1Value,
          
          field2Label: responseJson[0].eventField2Label,
          field2Value: responseJson[0].auxField2Value,
          field2DataUnit:responseJson[0].eventField2DataUnit,
          field2DataType: responseJson[0].eventField2DataType,
          field2DropdownDisplayValue: responseJson[0].auxField2Value,

          field3Label: responseJson[0].eventField3Label,
          field3Value: responseJson[0].auxField3Value,
          field3DataUnit:responseJson[0].eventField3DataUnit,
          field3DataType: responseJson[0].eventField3DataType,
          field3DropdownDisplayValue: responseJson[0].auxField3Value,

          field4Label: responseJson[0].eventField4Label,
          field4Value: responseJson[0].auxField4Value,
          field4DataUnit:responseJson[0].eventField4DataUnit,
          field4DataType: responseJson[0].eventField4DataType,
          field4DropdownDisplayValue: responseJson[0].auxField4Value,

          eventOperator: responseJson[0].eventOperator,
          operatorID: responseJson[0].eventOperatorID,
          commentsFieldDisplay:true,
          timestamp: new Date(responseJson[0].eventTimeStamp),
          timestampPickerDisplay: true,
          eventOperatorDisplay: true,
          animalTagDisplay: true,
          eventCodeDisplay: true,
          // auxField1Value: responseJson[0].auxField1Value,
          isLoaded: true, 
          eventAdditionalMessage: "", messageColor: "success"}); 
        this.showHideFields(responseJson[0]);
      }
    })
    .catch(error => this.setState({animalTag:"",  eventAdditionalMessage: error.toString(), messageColor: "danger"}));

    // retrieve Event Dropdown values  
    // fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event/allactive')
    // .then(response => response.json())
    // .then(responseJson => {
    //   if (responseJson.error) {
    //     this.setState({eventlist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
    //   }
    //   else {
    //     this.setState({eventlist: responseJson, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});   
    //     //alert(this.state.eventlist.length);      
    //   }
    // })
    // .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
  }
  
  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

showHideFields(responseJsonRecord) {

    // this.setState({field1Value: "", field2Value: "", field1DropdownDisplayValue: "", field2DropdownDisplayValue: ""});

    let field1Label = responseJsonRecord.eventField1Label;
    let field1DataType = responseJsonRecord.eventField1DataType;
    let field1DataUnit = responseJsonRecord.eventField1DataUnit;
    let dropDown1DisplayValue = "";

    let field2Label = responseJsonRecord.eventField2Label;
    let field2DataType = responseJsonRecord.eventField2DataType;
    let field2DataUnit = responseJsonRecord.eventField2DataUnit;
    let dropDown2DisplayValue = "";

    let field3Label = responseJsonRecord.eventField3Label;
    let field3DataType = responseJsonRecord.eventField3DataType;
    let field3DataUnit = responseJsonRecord.eventField3DataUnit;
    let dropDown3DisplayValue = "";

    let field4Label = responseJsonRecord.eventField4Label;
    let field4DataType = responseJsonRecord.eventField4DataType;
    let field4DataUnit = responseJsonRecord.eventField4DataUnit;
    let dropDown4DisplayValue = "";


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


    let recCount = 0;
    let item;



    if (field1DataType === "TEXT")
      field1TextDisplay = true;
    else if (field1DataType === "TEXTAREA")
      field1TextAreaDisplay = true;
    else if (field1DataType === "FLOAT")
      field1NumberDisplay = true;
    else if (field1DataType === "YESNO")
      field1YesNoDisplay = true;
    else if (field1DataType.indexOf("LV:") === 0) {
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
          for (recCount=0; recCount < responseJson.length; recCount++) {
            item = responseJson[recCount];
            if (item.code === responseJsonRecord.auxField1Value) {
              dropDown1DisplayValue = item.description + " (" + item.code + ")";
              this.setState({field1DropdownDisplayValue : dropDown1DisplayValue});
            }
          }
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
          for (recCount=0; recCount < responseJson.length; recCount++) {
            item = responseJson[recCount];
            if (item.lookupValueCode === responseJsonRecord.auxField1Value) {
              dropDown1DisplayValue = item.shortDescription + " (" + item.lookupValueCode + ")";
              // alert(dropDown1DisplayValue);
              this.setState({field1DropdownDisplayValue : dropDown1DisplayValue});
            }
          }

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
    else if (field2DataType.indexOf("LV:") === 0) {
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
          for (recCount=0; recCount < responseJson.length; recCount++) {
            item = responseJson[recCount];
            if (item.code === responseJsonRecord.auxField2Value) {
              dropDown2DisplayValue = item.description + " (" + item.code + ")";
              this.setState({field2DropdownDisplayValue : dropDown2DisplayValue});
            }
          }
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
          for (recCount=0; recCount < responseJson.length; recCount++) {
            item = responseJson[recCount];
            if (item.lookupValueCode === responseJsonRecord.auxField2Value) {
              dropDown2DisplayValue = item.shortDescription + " (" + item.lookupValueCode + ")";
              // alert(dropDown2DisplayValue);
              this.setState({field2DropdownDisplayValue : dropDown2DisplayValue});
            }
          }
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



    if (field3DataType === "TEXT")
      field3TextDisplay = true;
    else if (field3DataType === "TEXTAREA")
      field3TextAreaDisplay = true;
    else if (field3DataType === "FLOAT")
      field3NumberDisplay = true;
    else if (field3DataType === "YESNO")
      field3YesNoDisplay = true;
    else if (field3DataType.indexOf("LV:") === 0) {
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
          for (recCount=0; recCount < responseJson.length; recCount++) {
            item = responseJson[recCount];
            if (item.code === responseJsonRecord.auxField3Value) {
              dropDown3DisplayValue = item.description + " (" + item.code + ")";
              this.setState({field3DropdownDisplayValue : dropDown3DisplayValue});
            }
          }
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
          for (recCount=0; recCount < responseJson.length; recCount++) {
            item = responseJson[recCount];
            if (item.lookupValueCode === responseJsonRecord.auxField3Value) {
              dropDown3DisplayValue = item.shortDescription + " (" + item.lookupValueCode + ")";
              // alert(dropDown3DisplayValue);
              this.setState({field3DropdownDisplayValue : dropDown3DisplayValue});
            }
          }
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
    else if (field4DataType.indexOf("LV:") === 0) {
      // dropdown data type.
      field4DropdownDisplay = true;
      apiUrlPostfix =  field4DataType.substring(4);
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
          for (recCount=0; recCount < responseJson.length; recCount++) {
            item = responseJson[recCount];
            if (item.code === responseJsonRecord.auxField4Value) {
              dropDown4DisplayValue = item.description + " (" + item.code + ")";
              this.setState({field4DropdownDisplayValue : dropDown4DisplayValue});
            }
          }
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
          for (recCount=0; recCount < responseJson.length; recCount++) {
            item = responseJson[recCount];
            if (item.lookupValueCode === responseJsonRecord.auxField4Value) {
              dropDown4DisplayValue = item.shortDescription + " (" + item.lookupValueCode + ")";
              // alert(dropDown4DisplayValue);
              this.setState({field4DropdownDisplayValue : dropDown4DisplayValue});
            }
          }
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    } else if (field4DataType !== "") {
      // unknown datatype, probably because this data type is not yet implemented
      field4TextDisplay = true;
    }





    this.setState({
      field1Display: (field1Label !== ""), 
      field2Display: (field2Label !== ""),
      commentsFieldDisplay:true,

      messageColor: messageColor,
      eventAdditionalMessage: eventAdditionalMessage,

      field1Label: field1Label,
      field1DataUnit: field1DataUnit,
      field1TextDisplay : field1TextDisplay,
      field1TextAreaDisplay : field1TextAreaDisplay,
      field1NumberDisplay : field1NumberDisplay,
      field1YesNoDisplay : field1YesNoDisplay,
      field1DropdownDisplay: field1DropdownDisplay,

      field2Label: field2Label,
      field2DataUnit: field2DataUnit,
      field2TextDisplay : field2TextDisplay,
      field2TextAreaDisplay: field2TextAreaDisplay,
      field2NumberDisplay : field2NumberDisplay,
      field2YesNoDisplay : field2YesNoDisplay,
      field2DropdownDisplay: field2DropdownDisplay,
      field2DropdownDisplayValue : dropDown2DisplayValue,


      field3Label: field3Label,
      field3DataUnit: field3DataUnit,
      field3TextDisplay : field3TextDisplay,
      field3TextAreaDisplay: field3TextAreaDisplay,
      field3NumberDisplay : field3NumberDisplay,
      field3YesNoDisplay : field3YesNoDisplay,
      field3DropdownDisplay: field3DropdownDisplay,
      field3DropdownDisplayValue : dropDown3DisplayValue,

      field4Label: field4Label,
      field4DataUnit: field4DataUnit,
      field4TextDisplay : field4TextDisplay,
      field4TextAreaDisplay: field4TextAreaDisplay,
      field4NumberDisplay : field4NumberDisplay,
      field4YesNoDisplay : field4YesNoDisplay,
      field4DropdownDisplay: field4DropdownDisplay,
      field4DropdownDisplayValue : dropDown4DisplayValue,


    });
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
    this.setState({field4Value: event.target.value, field4DropdownDisplayValue: dropDownDisplayValue});
  }

  handleCommentsChanged(event) {
    this.setState({eventComments: event.target.value});
  }


  handleField1Changed(event) {
    this.setState({field1Value: event.target.value});
  }
  handleField2Changed(event) {
    this.setState({field2Value: event.target.value});
  }
  handleField3Changed(event) {
    this.setState({field3Value: event.target.value});
  }
  handleField4Changed(event) {
    this.setState({field4Value: event.target.value});
  }

  handleEventSelected(event) {
    this.setState({eventCode: event.target.value, eventCodeID: event.target.id});
  }
  handleTimestampChanged(newValue) {
    this.setState({timestamp: newValue});
  }

  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleOperatorSelected(event) {
    this.setState({eventOperator: event.target.value, operatorID: event.target.id});
  }



  handleDelete(event) {

    if (this.state.eventTransactionID === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Nothing to delete"});
    } else {
      fetch('http://localhost:8080/imd-farm-management/animalevent/deleteoneevent', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "eventTransactionID": this.state.eventTransactionID
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({eventAdditionalMessage: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({animalTag: "", eventCode: "", 
            eventComments: "", 
            eventOperator: "",
            timestamp: "",
            eventTransactionID: "",
            field1Value: "", 
            field2Value: "", 
            field3Value: "", 
            field4Value: "", 
            field1DropdownDisplayValue: "",
            field2DropdownDisplayValue: "",
            field3DropdownDisplayValue: "",
            field4DropdownDisplayValue: "",
            isLoaded: true, 
            eventAdditionalMessage: responseJson.message, messageColor: "success"});  
            this.hideEverything();

        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    }
  }
  hideEverything() {
    this.setState({field1TextDisplay: null,
      field1TextAreaDisplay: null,
      field1NumberDisplay: null,
      field1YesNoDisplay: null,
      field1DropdownDisplay: null,

      field2TextDisplay: null,
      field2TextAreaDisplay: null,
      field2NumberDisplay: null,
      field2YesNoDisplay: null,
      field2DropdownDisplay: null,

      field3TextDisplay: null,
      field3TextAreaDisplay: null,
      field3NumberDisplay: null,
      field3YesNoDisplay: null,
      field3DropdownDisplay: null,

      field4TextDisplay: null,
      field4TextAreaDisplay: null,
      field4NumberDisplay: null,
      field4YesNoDisplay: null,
      field4DropdownDisplay: null,

      timestampPickerDisplay: null,
      eventOperatorDisplay: null,
      commentsFieldDisplay: null,
      animalTagDisplay: null,
      eventCodeDisplay: null,

    });
    document.getElementById("updateButton").disabled = true;
    document.getElementById("deleteButton").disabled = true;
  }
  handleUpdate(event) {
    event.preventDefault();
    if (this.state.eventTransactionID === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Can't update what has already been deleted"});
    } else if (this.state.field1Label !== "" && this.state.field1Value === "") {
        this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field1Label});
    } else if (this.state.field2Label !== "" && this.state.field2Value === "") {
        this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field2Label});
    } else if (this.state.field3Label !== "" && this.state.field3Value === "") {
        this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field3Label});
    } else if (this.state.field4Label !== "" && this.state.field4Value === "") {
        this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field4Label});
    } else if (this.state.eventComments === "") {
        this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter comments"});
    } else {
        this.setState({eventAdditionalMessage: "Processing ..."});
        fetch('http://localhost:8080/imd-farm-management/animalevent/update', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "animalTag": this.state.animalTag,
              "eventTransactionID" : this.state.eventTransactionID,
              "eventComments": this.state.eventComments,
              "eventCode": this.state.eventCodeID,
              "eventTimeStamp": this.state.timestamp.toLocaleString(),
              "operatorID": this.state.operatorID,
              "auxField1Value": this.state.field1Value,
              "auxField2Value" : this.state.field2Value,
              "auxField3Value" : this.state.field3Value,
              "auxField4Value" : this.state.field4Value
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
    var { field1list, field2list, field3list, field4list, eventAdditionalMessage, messageColor, operatorlist} = this.state;
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

    let timestampPickerDisplay = this.state.timestampPickerDisplay ? {} : {display : 'none'};
    let eventOperatorDisplay = this.state.eventOperatorDisplay ? {} : {display : 'none'};

    let animalTagDisplay = this.state.animalTagDisplay ? {} : {display : 'none'};
    let eventCodeDisplay = this.state.eventCodeDisplay ? {} : {display : 'none'};

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="8">
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
                         <i className="fa fa-pencil"></i><strong>{' '}Edit</strong>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <Card>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row  style={animalTagDisplay}>
                          <Label sm="4" htmlFor="input-normal">Animal Tag</Label>
                          <Col sm="8">
                            {this.state.animalTag}
                          </Col>
                        </FormGroup>
                        <FormGroup row  style={eventCodeDisplay}>
                          <Label sm="4" htmlFor="input-normal">Event</Label>
                          <Col sm="8">
                            {this.state.eventCode}
                          </Col>
                        </FormGroup>
                        <FormGroup row  style={timestampPickerDisplay}>
                          <Label sm="4" htmlFor="input-normal">Timestamp</Label>
                          <Col sm="8">
                            <DateTimePicker id="timestampPicker" onChange={this.handleTimestampChanged} value={this.state.timestamp} required showLeadingZeros />
                          </Col>
                        </FormGroup>
                        <FormGroup row  style={eventOperatorDisplay}>
                          <Label sm="4" htmlFor="input-normal">Operator</Label>
                          <Col sm="8">
                            <InputGroup>
                              <Dropdown id="eventOperatorDropdown" isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle id="eventOperatorDropdownToggle" caret>
                                  {this.state.eventOperator}
                                </DropdownToggle>

                                <DropdownMenu id="eventOperatorDropdownMenu" onClick={this.handleOperatorSelected}
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
                              <DropdownToggle id="field1" caret>{this.state.field1Value}</DropdownToggle>
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
                                <DropdownToggle id="field1" caret>
                                  {this.state.field1DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field1" onClick={this.handleField1DropdownValueChanged}
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
                                  {field1list.map(item => (
                                  <DropdownItem id={field1Count++} value={(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode : "")} >{(item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")"}</DropdownItem>
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
                              <DropdownToggle  id="field2" caret>{this.state.field2Value}</DropdownToggle>
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
                                <DropdownToggle  id="field2" caret>
                                  {this.state.field2DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field2" onClick={this.handleField2DropdownValueChanged}
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
                                  {field2list.map(item => (
                                  <DropdownItem id={field2Count++} value={(item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode : "")} >{(item.description ? item.description : "") + (item.shortDescription ? item.shortDescription : "") + " (" + (item.code ? item.code : "") + (item.lookupValueCode ? item.lookupValueCode  : "") + ")"}</DropdownItem>
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
                            <Input id="field3" type="textarea" name={this.state.field3Label} rows="3" value={this.state.field3Value} onChange={this.handleField3Changed} />
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
                              <DropdownToggle  id="field3" caret>{this.state.field3Value}</DropdownToggle>
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
                                <DropdownToggle  id="field3" caret>
                                  {this.state.field3DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field3" onClick={this.handleField3DropdownValueChanged}
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
                            <Input id="field4" type="textarea" name={this.state.field4Label} rows="3" value={this.state.field4Value} onChange={this.handleField4Changed} />
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
                              <DropdownToggle  id="field4" caret>{this.state.field4Value}</DropdownToggle>
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
                                <DropdownToggle  id="field4" caret>
                                  {this.state.field4DropdownDisplayValue}
                                </DropdownToggle>
                              <DropdownMenu id="field4" onClick={this.handleField4DropdownValueChanged}
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
                            <Input id="eventComments" type="textarea" name="comments" rows="2" value={this.state.eventComments} onChange={this.handleCommentsChanged} />
                          </Col>
                        </FormGroup>


                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button id="updateButton" type="button" size="md" color="primary" onClick={this.handleUpdate}><i className="fa fa-edit"></i>{' '}Update</Button>&nbsp;&nbsp;
                      <Button id="deleteButton" type="button" size="md" color="primary" onClick={this.handleDelete}><i className="fa fa-remove"></i>{' '}Delete</Button>
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

export default UpdateAnimalEvent;
