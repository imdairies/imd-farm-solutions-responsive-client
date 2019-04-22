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
      dropdownOpen: new Array(7).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      items: [],
      eventlist: [],
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
      eventCode: "",

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

      messageColor: "muted",
      eventAdditionalMessage: "Specify desired values and press Add"
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);  
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleField1Changed = this.handleField1Changed.bind(this);
    this.handleField2Changed = this.handleField2Changed.bind(this);
    this.handleOperatorSelected = this.handleOperatorSelected.bind(this);
    this.handleEventSelected = this.handleEventSelected.bind(this);
    this.handleCommentsChanged = this.handleCommentsChanged.bind(this);
    this.showHideFields = this.showHideFields.bind(this);
    this.handleField1DropdownValueChanged = this.handleField1DropdownValueChanged.bind(this);
    this.handleField2DropdownValueChanged = this.handleField2DropdownValueChanged.bind(this);
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({eventTransactionID: parsed.eventTransactionID, animaltaglist: [], eventlist: [], operatorlist: [], isLoaded: false}); 

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
          commentsValue: responseJson[0].eventComments,
          field1Value: responseJson[0].auxField1Value,
          field1Label: responseJson[0].eventField1Label,
          field1DataUnit:responseJson[0].eventField1DataUnit,
          field1DataType: responseJson[0].eventField1DataType,
          field2Label: responseJson[0].eventField2Label,
          field2Value: responseJson[0].auxField2Value,
          field2DataUnit:responseJson[0].eventField2DataUnit,
          field2DataType: responseJson[0].eventField2DataType,
          eventOperator: responseJson[0].eventOperator,
          operatorID: responseJson[0].eventOperatorID,
          commentsFieldDisplay:true,
          timestamp: new Date(responseJson[0].eventTimeStamp), //new Date(),
          auxField1Value: responseJson[0].auxField1Value,
          isLoaded: true, 
          eventAdditionalMessage: "", messageColor: "success"}); 
          this.showHideFields(responseJson[0]);
      }
    })
    .catch(error => this.setState({animalTag:"",  eventAdditionalMessage: error.toString(), messageColor: "danger"}));


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
      field2DropdownDisplayValue : dropDown2DisplayValue

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

  handleCommentsChanged(event) {
      this.setState({commentsValue: event.target.value});
  }


  handleField2Changed(event) {
      this.setState({field2Value: event.target.value});
  }

  handleEventSelected(event) {
    this.setState({eventCode: event.target.value, eventCodeID: event.target.id});
  }
  handleTimestampChanged(newValue) {
    this.setState({timestamp: newValue});
  }
  handleField1Changed(event) {
    this.setState({field1Value: event.target.value});
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
            auxField1Value: "", 
            isLoaded: true, 
            eventAdditionalMessage: responseJson.message, messageColor: "success"});  
            document.getElementById("eventCodeDropdown").disabled = true;
            document.getElementById("eventOperatorDropdown").disabled = true;
            document.getElementById("eventComments").disabled = true;
            document.getElementById("auxField1Value").disabled = true;
            //document.getElementById("timestamp").disabled = true;

        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
    }
  }
  handleUpdate(event) {
    event.preventDefault();
    if (this.state.eventTransactionID === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Can't update what has already been deleted"});
    } else if (this.state.field1Label !== "" && this.state.field1Value === "") {
        this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field1Label});
    } else if (this.state.field2Label !== "" && this.state.field2Value === "") {
        this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter " + this.state.field2Label});
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
              "eventComments": this.state.commentsValue,
              "eventCode": this.state.eventCodeID,
              "eventTimeStamp": this.state.timestamp.toLocaleString(),
              "operatorID": this.state.operatorID,
              "auxField1Value": this.state.field1Value,
              "auxField2Value" : this.state.field2Value,
              "auxField3Value" : this.state.auxField3Value
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
    var { field1list, field2list, eventAdditionalMessage, messageColor, operatorlist} = this.state;
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
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Animal Tag</Label>
                          <Col sm="8">
                            {this.state.animalTag}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Event</Label>
                          <Col sm="8">
                            {this.state.eventCode}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Timestamp</Label>
                          <Col sm="8">
                            <DateTimePicker id="timestamp" onChange={this.handleTimestampChanged} value={this.state.timestamp} required showLeadingZeros />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Operator</Label>
                          <Col sm="8">
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle id="eventOperatorDropdown" caret>
                                  {this.state.eventOperator}
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
                            <Dropdown isOpen={this.state.dropdownOpen[3]} toggle={() => {
                              this.toggle(3);}}>
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
                              <Dropdown isOpen={this.state.dropdownOpen[5]} toggle={() => {
                                this.toggle(5);
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




                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleUpdate}><i className="fa fa-edit"></i>{' '}Update</Button>&nbsp;&nbsp;
                      <Button type="button" size="md" color="primary" onClick={this.handleDelete}><i className="fa fa-remove"></i>{' '}Delete</Button>
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
