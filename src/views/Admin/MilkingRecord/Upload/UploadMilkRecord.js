import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';

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
} from 'reactstrap';


var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';


class UploadMilkRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      dropdownOpen: new Array(2).fill(false),
      warning: false,
      items: [],
      fadeIn: true,
      isLoaded: false,
      timeout: 300,
      messageColor: "muted",
      parseOrCommit: "Parse",
      outcomeMessage: "Fill out batch values and press the button to upload",
      parseResult: "",
      showParseResult: false,
      line1Contents : "",
      line2Contents : "",
      line3Contents : "",
      cowTags :"",
      date: "",
      time: "",
      event:"",
      temp: "",
      humidity: "",
      fat: "",
      lr: "",
      toxin: "",
      authenticated: true,
      milkRecords : ""
    };
    this.handleParseOrCommit = this.handleParseOrCommit.bind(this);
    this.handleLine1Changed = this.handleLine1Changed.bind(this);
    this.handleLine2Changed = this.handleLine2Changed.bind(this);
    this.handleLine3Changed = this.handleLine3Changed.bind(this);
    this.handleCowTagsChanged = this.handleCowTagsChanged.bind(this);
    this.handleMilkRecordsChanged = this.handleMilkRecordsChanged.bind(this);
    this.concatenateInputValues = this.concatenateInputValues.bind(this);
  }

  handleLine1Changed(event) {
    if (event.target.id === "date")
      this.setState({date: event.target.value});
    else if (event.target.id === "time")
      this.setState({time: event.target.value});
    else if (event.target.id === "event")
      this.setState({event: event.target.value});
    this.setState({parseOrCommit: "Parse"});
  }

  handleLine2Changed(event) {
    if (event.target.id === "temp")
      this.setState({temp: event.target.value});
    else if (event.target.id === "humidity")
      this.setState({humidity: event.target.value});
    this.setState({parseOrCommit: "Parse"});
  }
  handleLine3Changed(event) {
    if (event.target.id === "fat")
      this.setState({fat: event.target.value});
    else if (event.target.id === "lr")
      this.setState({lr: event.target.value});
    else if (event.target.id === "toxin")
      this.setState({toxin: event.target.value});
    this.setState({parseOrCommit: "Parse"});
  }
  concatenateInputValues(date, time, evt,temp,humidity,fat,lr,toxin,cowTags,milkRecords) {
    let results = "";
    results = date.trim() + "\t" + time.trim() + "\t" + evt.trim() + "\n" +
              temp.trim() + "\t" + humidity.trim() + "\n" +
              fat.trim() + "\t" + lr.trim() + "\t" + toxin.trim() + "\n";

    let cowTagsList = cowTags.trim().split("\n");
    let cowRecordsList = milkRecords.trim().split("\n");
    if (cowTagsList.length !== cowRecordsList.length)
      return null;
    for (let i=0; i< cowTagsList.length; i++) {
      results += cowTagsList[i] + "\t" + cowRecordsList[i] + "\n";
    }
    return results;
  }

  handleCowTagsChanged(event) {
    this.setState({parseOrCommit: "Parse", cowTags: event.target.value});
  }
  handleMilkRecordsChanged(event) {
    this.setState({parseOrCommit: "Parse", milkRecords: event.target.value});
  }

  handleParseOrCommit(event) {
    let wasParseOrCommit = this.state.parseOrCommit;
    let outcomeMessage = "";
    let date = document.getElementById("date").value;
    let time = document.getElementById("time").value;
    let evt = document.getElementById("event").value;
    let temp = document.getElementById("temp").value;
    let humidity = document.getElementById("humidity").value;
    let fat = document.getElementById("fat").value;
    let lr = document.getElementById("lr").value;
    let toxin = document.getElementById("toxin").value;
    let cowTags = document.getElementById("cowTags").value;
    let milkRecords = document.getElementById("milkRecords").value;

    let cowTagsCount = cowTags.trim().split("\n").length;
    let milkRecordsCount = milkRecords.trim().split("\n").length;

    // alert("[" + date + "][" + time + "][" + evt + "]");

    if (date.length === 0) {
      this.setState({messageColor: "danger", outcomeMessage: "Please enter line 1 Date"});
      document.getElementById("date").focus();
    } else if (time.length === 0) {
      this.setState({messageColor: "danger", outcomeMessage: "Please enter line 1 Time"});
      document.getElementById("time").focus();
    } else if (evt.length === 0) {
      this.setState({messageColor: "danger", outcomeMessage: "Please enter line 1 Event"});
      document.getElementById("event").focus();
    } else if (temp.length === 0) {
      this.setState({messageColor: "danger", outcomeMessage: "Please enter line 2 Temperature"});
      document.getElementById("temp").focus();
    // } else if (this.state.humidity.length === 0) {
    //   this.setState({messageColor: "danger", outcomeMessage: "Please enter line 2 Humidity"});
    //   document.getElementById("humidity").focus();
    // } else if (this.state.fat.length === 0) {
    //   this.setState({messageColor: "danger", outcomeMessage: "Please enter line 3 Fat"});
    //   document.getElementById("fat").focus();
    // } else if (this.state.lr.length === 0) {
    //   this.setState({messageColor: "danger", outcomeMessage: "Please enter line 3 LR"});
    //   document.getElementById("lr").focus();
    // } else if (this.state.toxin.length === 0) {
    //   this.setState({messageColor: "danger", outcomeMessage: "Please enter line 3 Toxin"});
    //   document.getElementById("toxin").focus();
    } else if (cowTags.length === 0) {
      this.setState({messageColor: "danger", outcomeMessage: "Please enter Cow Tags Values"});
      document.getElementById("cowTags").focus();
    } else if (milkRecords.length === 0) {
      this.setState({messageColor: "danger", outcomeMessage: "Please enter Milking Records Values"});
      document.getElementById("milkRecords").focus();
    } else if (cowTagsCount !== milkRecordsCount) {
      this.setState({messageColor: "danger", outcomeMessage: "You have specified " + cowTagsCount + " cow tags and " + milkRecordsCount + " milk records. Each cow tag should have exactly one milk record specified"});
      document.getElementById("cowTags").focus();
    } else {
      this.setState({outcomeMessage: "Processing ..."});
      let fileContents = this.concatenateInputValues(date, time, evt,temp,humidity,fat,lr,toxin,cowTags,milkRecords);
      if (fileContents === null) {
        this.setState({messageColor: "danger", outcomeMessage: "The number of Cow Tags and milk records must be exactly the same. Please modify the Cow Tags and/or Milk Records values to fix the mis-match."});
      }
      else {
        fetch(API_PREFIX + '/imd-farm-management/milkinginfo/uploadfarmmilkingevent', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "shouldAdd": this.state.parseOrCommit === "Commit" ? true : false,
              "inputDelimitedFileContents" : fileContents,
              "loginToken": (new Cookies()).get('authToken'),
        })
      })
      .then(response => {
        if (response.status === 401)
          this.setState({authenticated : false});
        return response.json();
      })
      .then(data => {
      if (data.error) {
             this.setState({isLoaded: true, outcomeMessage: data.message, messageColor: "danger"});
          }
          else {
            if ( wasParseOrCommit === "Parse") {
              // successfully parsed
              outcomeMessage = data.message + ". You may commit the records now.";
            } else {
              // committing
               this.setState({isLoaded: true, outcomeMessage: data.message, messageColor: "success"});
               for (let i=0; i< data.length; i++) {
                if (data[i].outcome === "ERROR") {
                  outcomeMessage += data[i].tag + " ";
                }
              }
              if (outcomeMessage === "") {
                outcomeMessage = "All " + data.length + " milking information(s) updated successfully";
                this.setState({outcomeMessage: outcomeMessage, messageColor:"success"});
              } else {
                outcomeMessage = "Milking information for the following tag numbers could not be updated, the rest have been updated successfully:" + outcomeMessage;
                this.setState({outcomeMessage: outcomeMessage, messageColor:"danger"});
              }
            }
            this.setState({showParseResult: wasParseOrCommit === "Parse" ? true : false, 
              parseOrCommit: (wasParseOrCommit === "Parse" ? "Commit": "Parse"),
              isLoaded: true,
              date: data.date,
              time: data.time,
              event: data.event,
              temperature: data.temperature,
              humidity: data.humidity,
              fat: data.fat,
              lr: data.lr,
              toxin: data.toxin,
              totalMilkRecords: data.totalMilkRecords,
              totalVolume: data.totalVolume,
              outcomeMessage: outcomeMessage,
              messageColor: "success"});
            }
          })
        .catch(error => this.setState({outcomeMessage: error.toString(), messageColor: "danger"}));
      }
    }
  }

  render() {
    var { authenticated, date,time,event,temp,humidity,fat,lr,toxin,cowTags,milkRecords, outcomeMessage, messageColor, parseOrCommit} = this.state;
    //var yesterday = this.state.timestamp;
    let parsingResultsDisplay  = this.state.showParseResult ? {} : {display : 'none'};
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
                      <i className="fa fa-align-justify"></i><strong>Farm Milking Information</strong>
                    </CardHeader>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormText color={messageColor}>&nbsp;{outcomeMessage}</FormText>
                        <FormGroup row>
                          <Label sm="2" htmlFor="input-normal"><strong>Line 1</strong></Label>
                          <Col sm="4">
                            <Input id="date" name="date" size="10" max="10" value = {date} onChange={this.handleLine1Changed} placeholder="yyyy-mm-dd"  />
                          </Col>
                          <Col sm="3">
                            <Input id="time" name="time"  size="5" max="5" value = {time} onChange={this.handleLine1Changed} placeholder="HH:mm"  />
                          </Col>
                          <Col sm="2">
                            <Input id="event" name="event" size="1" max="1"  value = {event} onChange={this.handleLine1Changed} placeholder="n"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="2" htmlFor="input-normal"><strong>Line 2</strong></Label>
                          <Col sm="2">
                            <Input id="temp" name="temp"  value = {temp} onChange={this.handleLine2Changed} placeholder="°C"  />
                          </Col>
                          <Col sm="2">
                            <Input id="humidity" name="humidity"  value = {humidity} onChange={this.handleLine2Changed} placeholder="%hum"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="2" htmlFor="input-normal"><strong>Line 3</strong></Label>
                          <Col sm="2">
                            <Input id="fat" name="fat"  value = {fat} onChange={this.handleLine3Changed} placeholder="Fat"  />
                          </Col>
                          <Col sm="2">
                            <Input id="lr" name="lr"  value = {lr} onChange={this.handleLine3Changed} placeholder="LR"  />
                          </Col>
                          <Col sm="2">
                            <Input id="toxin" name="toxin"  value = {toxin} onChange={this.handleLine3Changed} placeholder="Toxin"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="2" htmlFor="input-normal"><strong>Tags</strong></Label>
                          <Col sm="2">
                            <textarea id="cowTags"  type="textarea" name="cowTags" rows="20" cols="3" value = {cowTags} onChange={this.handleCowTagsChanged} placeholder="012&#13;&#10;014&#13;&#10;015&#13;&#10;..."  />
                          </Col>
                          <Label sm="3" htmlFor="input-normal"><strong>Milk Records</strong></Label>
                          <Col sm="2">
                            <textarea id="milkRecords" type="textarea" name="milkRecords" rows="20" cols="3" value = {milkRecords} onChange={this.handleMilkRecordsChanged} placeholder="14.5&#13;&#10;13.5&#13;&#10;14&#13;&#10;..."  />
                          </Col>
                        </FormGroup>
                        <FormGroup row style={parsingResultsDisplay} >
                          <Label sm="2" htmlFor="input-normal"><strong>Parsing Results</strong></Label>
                          <Col sm="8" width="100%">
                            Date: {this.state.date}<br/>
                            Time: {this.state.time}<br/>
                            Event: {this.state.event}<br/>
                            Temperature: {this.state.temperature}<br/>
                            Humidity: {this.state.humidity}<br/>
                            Fat: {this.state.fat}<br/>
                            LR: {this.state.lr}<br/>
                            Toxin: {this.state.toxin}<br/>
                            Total Milking Records: {this.state.totalMilkRecords}<br/>
                            Total Volume: {this.state.totalVolume}<br/>
                          </Col>
                        </FormGroup>




                        <FormText color={messageColor}>&nbsp;{outcomeMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleParseOrCommit}><i className={parseOrCommit === "Parse" ? "fa fa-pencil" : "fa fa-plus"}></i>{' ' + parseOrCommit}</Button>
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

export default UploadMilkRecord;
