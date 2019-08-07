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
  Table,
  InputGroup,
//  InputGroupText,
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


class AddFarmDailyMilk extends Component {
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
      animaltaglist: [],
      animalTag: "-- Select Tag --",
      milkingEventNumber: this.determineCurrentEventNumber(),
      milkVolume: "",
      messageColor: "muted",
      timestamp: new Date(),
      milkingVloume: [],
      addOrUpdate: "Add",
      comments: "",
      SNF: "",
      TS: "",
      fatValue: "",
      lrValue: "",
      toxinValue: "",
      temperatureInCentigrade: "",
      humidity: "",
      eventAdditionalMessage: "Specify desired values and press Add",
      totalMilkMessage: "",
      previousTotalMilkMessage: "",
      avgTotalMilkMessage: "",
      farmAverageMonthInMilking: 0
    };
    this.handleAnimalTagSelected = this.handleAnimalTagSelected.bind(this);
    this.handleEventNumberSelected = this.handleEventNumberSelected.bind(this);
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);    
    this.handleValueChanged = this.handleValueChanged.bind(this);
    this.determineCurrentEventNumber = this.determineCurrentEventNumber.bind(this);
    this.fetchMilkingRecordForTheEvent = this.fetchMilkingRecordForTheEvent.bind(this);
    this.handleVolumeValueChanged = this.handleVolumeValueChanged.bind(this);
    this.handleCommentsValueChanged = this.handleCommentsValueChanged.bind(this);
    this.initializeEventTime = this.initializeEventTime.bind(this);
    this.initializeEventTime(this.state.milkingEventNumber);
  }

  initializeEventTime(eventNumber) {
    // alert(eventNumber);
    let hours = 0;
    let minutes = 0;
    // alert(eventNumber);
    if (eventNumber === "1") {
      hours = 4;
      minutes = 0;
    }
    else if (eventNumber === "2") {
      hours = 12
      minutes = 0;
    }
    else if (eventNumber === "3") {
      hours = 20;
      minutes = 0;
    }
    let updatedTimestamp = this.state.timestamp;
    updatedTimestamp.setHours(hours);
    updatedTimestamp.setMinutes(minutes);
    this.setState({timestamp: updatedTimestamp});
    // this.setState({ state: this.state });
    // this.forceUpdate();
  }
  determineCurrentEventNumber() {
    let currTS = new Date();
    let currentHourofDay = currTS.getHours();

    // alert("Current Hour" + currentHourofDay);
    if (currentHourofDay >= 0 && currentHourofDay <= 12) {
      // currTS.setHours(5);
      // this.setState({timestamp:currTS});
     return "1";
    }
    else if (currentHourofDay > 12 && currentHourofDay <= 20){
      // currTS.setHours(13);
      // this.setState({timestamp:currTS});
     return "2";
    }
    else if (currentHourofDay > 20){
      // currTS.setHours(21);
      // this.setState({timestamp:currTS});
     return "3";
    }
    // this.setState({timestamp: currTS});
  }

  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleTimestampChanged(newValue) {
    if (newValue.getFullYear() != this.state.timestamp.getFullYear() || 
      newValue.getMonth() != this.state.timestamp.getMonth() || 
      newValue.getDate() != this.state.timestamp.getDate()) 
    {
      this.setState({timestamp: newValue});
      this.fetchMilkingRecordForTheEvent(this.state.milkingEventNumber, newValue);
    } else 
        this.setState({timestamp: newValue});
  }

  handleVolumeValueChanged(event) {
    let items = this.state.animaltaglist;
    let item = this.state.animaltaglist[event.target.id];
    let temperature = this.state.temperatureInCentigrade;
    let humidity = this.state.humidity;
    let fat = this.state.fatValue;
    let lr = this.state.lrValue;
    let toxin = this.state.toxinValue;
    item.milkVolume = event.target.value;
    items[event.target.id] = item;
    this.setState({animaltaglist: items});
    this.calculateTotal(items, false, false);
    this.setState({temperatureInCentigrade: temperature, humidity:humidity, fatValue: fat, lrValue:lr, toxinValue:toxin});

  }
  calculateTotal(items, shouldDetermineAddOrUpdate, shouldCalculatePastAverages) {
    let totalMilk = 0;
    let previousTotalMilk = 0;
    let avgTotalMilk = 0;
    let totalDaysInMilking = 0;
    let temperature = "";
    let humidity = "";
    let fat = "";
    let lr = "";
    let toxin = "";
    for (let i=0; i<items.length; i++){
      if (temperature === "" && items[i].temperatureInCentigrade !== 0) {
        temperature = items[i].temperatureInCentigrade;
        fat = items[i].fatValue;
        lr = items[i].lrValue;
        humidity = items[i].humidity;
        toxin = items[i].toxinValue;
      }
      totalMilk += parseFloat((isNaN(items[i].milkVolume) || items[i].milkVolume === "") ? "0" : items[i].milkVolume);
      totalDaysInMilking += parseFloat((isNaN(items[i].DAYS_IN_MILKING) || items[i].DAYS_IN_MILKING === "" || items[i].DAYS_IN_MILKING < 0) ? 0 : items[i].DAYS_IN_MILKING);
      if (shouldCalculatePastAverages){
        avgTotalMilk += parseFloat(isNaN(items[i].SEQ_NBR_MONTHLY_AVERAGE) ? "0" : items[i].SEQ_NBR_MONTHLY_AVERAGE);
        previousTotalMilk += parseFloat(isNaN(items[i].YESTERDAY_SEQ_NBR_VOL) ? "0" : items[i].YESTERDAY_SEQ_NBR_VOL);
      }
    }
    this.setState({temperatureInCentigrade:temperature, 
      fatValue: fat, lrValue:lr, humidity: humidity, toxinValue:toxin,
      SNF:((lr / 4) + (fat * 0.22)+0.72),
      farmAverageMonthInMilking: items.length === 0 ? 0 : parseFloat(parseFloat(totalDaysInMilking/30)/items.length)});
    if (shouldDetermineAddOrUpdate)
      this.setState({totalMilkMessage: "" + totalMilk,
        addOrUpdate: (totalMilk === 0 ? "Add" : "Update")});
    else
      this.setState({totalMilkMessage: "" + totalMilk});

    if (shouldCalculatePastAverages){
      this.setState({previousTotalMilkMessage: "" + Math.round(previousTotalMilk),
        avgTotalMilkMessage: "" + Math.round(avgTotalMilk)});  
    }

  }

  handleCommentsValueChanged(event) {
    // alert(event.target.value);
    // alert(event.target.id);
    // alert(this.state.animaltaglist[event.target.id].milkVolume);

    let items = this.state.animaltaglist;
    let item = this.state.animaltaglist[event.target.id];
    item.comments = event.target.value;
    items[event.target.id] = item;
    this.setState({animaltaglist: items});
  }

  handleValueChanged(event){
    let fatValue = this.state.fatValue;
    let lrValue = this.state.lrValue;

    if (event.target.id === "fatValue") {
      fatValue = event.target.value;
      this.setState({fatValue: event.target.value});
    }
    else if (event.target.id === "lrValue") {
      lrValue = event.target.value;
      this.setState({lrValue: event.target.value});
    }
    else if (event.target.id === "toxinValue")
      this.setState({toxinValue: event.target.value});
    else if (event.target.id === "temperatureInCentigrade")
      this.setState({temperatureInCentigrade: event.target.value});
    else if (event.target.id === "humidity")
      this.setState({humidity: event.target.value});
    this.setState({SNF: ((lrValue / 4) + (fatValue * 0.22)+0.72)})
  }

  componentDidMount() {
//    const parsed = queryString.parse(this.props.location.search);
    // this.setState({lookupValueCode: parsed.lookupValueCode, animaltaglist: [], eventlist: [], operatorlist: [], isLoaded: false}); 
    this.setState({animaltaglist: [], isLoaded: false}); 
    this.fetchMilkingRecordForTheEvent(this.state.milkingEventNumber, this.state.timestamp);
   }

   fetchMilkingRecordForTheEvent(eventNumber, timestampValue){
    if (timestampValue !== null) {
      fetch('http://localhost:8080/imd-farm-management/animals/lactatingcowsmilkrecord', {
              method: "POST",
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  "animalTag": "%",
                  "milkingDateStr": timestampValue.getFullYear() + "-" + (timestampValue.getMonth()+1) + "-" + timestampValue.getDate(),
                  "milkingTimeStr" : timestampValue.getHours() + ":" + timestampValue.getMinutes(),
                  "milkingEventNumber": eventNumber,
                  "lrValue": this.state.lrValue,
                  "fatValue": this.state.fatValue,
                  "toxinValue": this.state.toxinValue,
                  "temperatureInCentigrade": this.state.temperatureInCentigrade,
                  "humidity": this.state.humidity,
                  "timestamp": timestampValue
            })
          })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.error) {
               this.setState({animaltaglist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
            }
            else {
                let eventTimestamp = this.state.timestamp;
                let i=0;
                for (i=0; i<responseJson.length;i++) {
                  if (!(responseJson[i].recordDate === "" || responseJson[i].recordTime === ""))
                     eventTimestamp = new Date(responseJson[i].recordDate + " " + responseJson[i].recordTime);                  
                }
                this.setState({animaltaglist: responseJson,
                  // temperatureInCentigrade: (responseJson[0].temperatureInCentigrade !== 0 ? responseJson[0].temperatureInCentigrade : ""),
                  // humidity: (responseJson[0].humidity !== 0 ? responseJson[0].humidity : ""),
                  // fatValue: (responseJson[0].fatValue !== 0 ? responseJson[0].fatValue : ""),
                  // lrValue: (responseJson[0].lrValue !== 0 ? responseJson[0].lrValue  : ""),
                  // toxinValue:(responseJson[0].toxinValue !== 0 ? responseJson[0].toxinValue  : ""),
                  // SNF:((responseJson[0].lrValue / 4) + (responseJson[0].fatValue * 0.22)+0.72),
                  timestamp: eventTimestamp,
                  isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});
                this.calculateTotal(responseJson, true, true);
            }
          })
          .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
        }
   }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  handleAnimalTagSelected(event) {
    this.setState({animalTag: event.target.value});
  }

  handleEventNumberSelected(event) {
    this.setState({milkingEventNumber: event.target.value});
    this.fetchMilkingRecordForTheEvent(event.target.value, this.state.timestamp);
    //this.initializeEventTime(event.target.value);
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

    if (this.state.milkingEventNumber.length === 0 || this.state.milkingEventNumber === "-- Select Milking Event --") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please select a milking event"});
      document.getElementById("milkingEventNumber").focus();
    } else if (this.state.temperatureInCentigrade === "") {
      this.setState({messageColor: "danger", eventAdditionalMessage: "Please enter temperature"});
      document.getElementById("temperatureInCentigrade").focus();
    } else {
      this.setState({eventAdditionalMessage: "Processing ..."});
      let farmMilkingEventRecords = [];
      let totalVolume = 0.0;
      // alert("cow tags " + this.state.animaltaglist.length);
      for (let i=0; i< this.state.animaltaglist.length; i++) {
        let item = this.state.animaltaglist[i];
        let vol = parseFloat(item.milkVolume);
        totalVolume += isNaN(vol) ? 0 : vol;
        farmMilkingEventRecords.push({tag:item.animalTag,volume:item.milkVolume, comments:item.comments, outcome:item.animalTag});
      }
      // alert(totalVolume);
      // alert(JSON.stringify(farmMilkingEventRecords));
      // if (isNaN(totalVolume)) {
      //   this.setState({eventAdditionalMessage: "One or more milk volume(s) is/are invalid. Please fix the problem before proceeding.", messageColor: "danger"});
      // } 
      if (totalVolume === 0) {
        this.setState({eventAdditionalMessage: "You have not specified any milk volume", messageColor: "danger"});
      } else {
        fetch('http://localhost:8080/imd-farm-management/milkinginfo/addfarmmilkingevent', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "milkingDateStr": this.state.timestamp.getFullYear() + "-" + (this.state.timestamp.getMonth()+1) + "-" + this.state.timestamp.getDate(),
              "milkingTimeStr" : this.state.timestamp.getHours() + ":" + this.state.timestamp.getMinutes(),
              "milkingEventNumber": this.state.milkingEventNumber,
              "lrValue": this.state.lrValue,
              "fatValue": this.state.fatValue,
              "toxinValue": this.state.toxinValue,
              "temperatureInCentigrade": this.state.temperatureInCentigrade,
              "humidity": this.state.humidity,
              "timestamp": this.state.timestamp,
              farmMilkingEventRecords
             // "tagVolume1" : [{"tag":"012", "volume":"01"},{"tag":"014", "volume":"2"},{"tag":"015", "volume":"3"},{"tag":"017", "volume":"4"},{"tag":"019", "volume":"5"},{"tag":"020", "volume":"6"},{"tag":"021", "volume":"7"},{"tag":"023", "volume":"8"},{"tag":"025", "volume":"9"},{"tag":"026", "volume":"10"},{"tag":"027", "volume":"11"},{"tag":"029", "volume":"12"},{"tag":"030", "volume":"11"},{"tag":"031", "volume":"13"},{"tag":"034", "volume":"14"},{"tag":"035", "volume":"15"},{"tag":"036", "volume":"16"}]
          })
        })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.error) {
             this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
          }
          else {
            let outcomeMessage = "";
            let totalMilk = 0;
             this.setState({isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "success"});
             for (let i=0; i< responseJson.length; i++) {
              if (responseJson[i].outcome === "ERROR") {
                outcomeMessage += responseJson[i].tag + " ";
              }
              totalMilk += parseFloat(responseJson[i].volume);
            }
            this.setState({totalMilkMessage: "" + totalMilk, addOrUpdate: (totalMilk === 0 ? "Add" : "Update")});

            if (outcomeMessage === "") {
              outcomeMessage = "All " + responseJson.length + " milking information(s) updated successfully";
              this.setState({eventAdditionalMessage: outcomeMessage, messageColor:"success"});
            } else {
              outcomeMessage = "Milking information for the following tag numbers could not be updated, the rest have been updated successfully:" + outcomeMessage;
              this.setState({eventAdditionalMessage: outcomeMessage, messageColor:"danger"});
            }
          }
        })
        .catch(error => this.setState({eventAdditionalMessage: "Exception >> " + error.toString(), messageColor: "danger"}));
      }
    }
  }

  render() {
    var { farmAverageMonthInMilking, eventAdditionalMessage, messageColor, addOrUpdate, totalMilkMessage, animaltaglist, isLoaded, previousTotalMilkMessage, avgTotalMilkMessage} = this.state;
    let recordCount = 0;
    //var yesterday = this.state.timestamp;
    let days = this.state.timestamp.getDate();
    let month = this.state.timestamp.getMonth();
    let year = this.state.timestamp.getFullYear();
    if (days > 1) {
      days = days -1;
    } else {
      if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10) {
        days = 31;
        month = month -1;
      } else if (month == 4 || month == 6 || month == 9 || month == 11) {
        days = 30;
      } else if (month == 0) {
        days = 31;
        month = 11;
        year = year - 1;
      } else if ((year % 4) == 0 ) {
        // leap year
        days = 29;
        month = month -1;
      } else {
        days = 28;
        month = month -1;
      }
    }
    let yesterday = new Date(year, month, days);
    // Jan 0 - 31 (year --)
    // Feb 1 - 31
    // Mar 2 - 28/29
    // Apr 3 -31
    // May 4 - 30
    // June 5 - 31
    // July 6 -30
    // Aug 7 - 31
    // Sep 8 - 31
    // Oct 9 -30
    // Nov 10 - 31
    // Dec 11 - 30
       
    //yesterday = new Date().setDate(yesterday.getDate());
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
                             <i className={addOrUpdate === "Add" ? "fa fa-plus": "fa fa-pencil"}></i><strong>{' ' + addOrUpdate}</strong>
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <Form action="" method="post" className="form-horizontal">
                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal"><strong>Environment</strong></Label>
                          <Col sm="2">
                            <Input id="temperatureInCentigrade" maxlength="5" type="number"  min={0} max={60} step={0.1} name="temperatureInCentigrade" value={this.state.temperatureInCentigrade} onChange={this.handleValueChanged} placeholder="°C"  />
                          </Col>
                          <Col sm="2">
                            <Input id="humidity" maxlength="5" type="number" min={0} max={100} step={0.5} name="humidity" value={this.state.humidity} onChange={this.handleValueChanged} placeholder="% humidity"  />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal"><strong>Quality</strong></Label>
                          <Col sm="2">
                            <Input id="fatValue" maxlength="5"  min={2} max={7} step={0.5} type="number" name="fatValue" value={this.state.fatValue} onChange={this.handleValueChanged} placeholder="Fat"  />
                          </Col>
                          <Col sm="2">
                            <Input id="lrValue" maxlength="5" type="number"  min={25} max={32} step={0.5} name="lrValue" value={this.state.lrValue} onChange={this.handleValueChanged} placeholder="LR"  />
                          </Col>
                          <Col sm="2">
                            <strong>SNF:</strong>{Math.round(parseFloat(this.state.SNF)*100)/100 > 0.72 ? Math.round(parseFloat(this.state.SNF)*100)/100 : ""}
                          </Col>
                          <Col sm="2">
                            <strong>TS:</strong>{isNaN(Math.round((parseFloat(this.state.SNF) + parseFloat(this.state.fatValue))*100)/100) || (Math.round((parseFloat(this.state.SNF) + parseFloat(this.state.fatValue))*100)/100) <= 0.72   ? "" : Math.round((parseFloat(this.state.SNF) + parseFloat(this.state.fatValue))*100)/100}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="3" htmlFor="input-normal"><strong>Milking Event</strong></Label>
                          <Col sm="5">
                            <DateTimePicker id="timestampPicker" /*maxDate={new Date()}*/ onChange={this.handleTimestampChanged} value={this.state.timestamp} required showLeadingZeros />
                          </Col>
                          <Col sm="2">
                            <InputGroup>
                              <Dropdown id="milkingEventNumber" isOpen={this.state.dropdownOpen[1]} toggle={() => {
                                this.toggle(1);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.milkingEventNumber}
                                </DropdownToggle>
                                <DropdownMenu onClick={this.handleEventNumberSelected}>
                                  <DropdownItem id="one" value="1"   >1 - Morning Milking</DropdownItem>
                                  <DropdownItem id="two" value="2"   >2 - Noon Milking</DropdownItem>
                                  <DropdownItem id="three" value="3" >3 - Night Milking</DropdownItem>
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                           <Table hover bordered striped responsive size="md">
                             <thead>
                                <tr>
                                  <th>Tag</th>
                                  <th>MiM</th>
                                  <th>Avg.</th>
                                  <th>{(yesterday.getDate()) + "/" + (yesterday.getMonth()+1)}</th>
                                  <th>Vol</th>
                                  <th>comments</th>
                                </tr> 
                             </thead>
                             <tbody>
                                <tr>
                                  <th></th>
                                  <th>
                                    <FormText color="success"><strong>&nbsp;{Math.round(farmAverageMonthInMilking*100)/100}</strong></FormText>
                                  </th>
                                  <th>
                                    <FormText color="success"><b>&nbsp;{avgTotalMilkMessage}</b></FormText>
                                  </th>
                                  <th>
                                    <FormText color="success"><b>&nbsp;{previousTotalMilkMessage}</b></FormText>
                                  </th>
                                  <th>
                                    <FormText color="success"><b>&nbsp;{totalMilkMessage}</b></FormText>
                                  </th>
                                  <th></th>
                                </tr> 
                              {animaltaglist.map(animaltagitem => (
                                <tr id={animaltagitem.animalTag}>
                                    <td width="9%"><Link  tabindex="-1" to={'/animal/update?animalTag?orgID=IMD&&animalTag=' + animaltagitem.animalTag}>{animaltagitem.animalTag}</Link></td>
                                    <td width="5%">{parseFloat(Math.round(animaltagitem.DAYS_IN_MILKING /30 * 10)/10)}</td>
                                    <td width="8%">{animaltagitem.SEQ_NBR_MONTHLY_AVERAGE}</td>
                                    <td width="8%">{animaltagitem.YESTERDAY_SEQ_NBR_VOL}</td>
                                    <td width="30%">
                                      <Input id={recordCount} type="number" min={0} max={20} step={0.25} name={'"milkVolume' + animaltagitem.animalTag + '"'} value={animaltagitem.milkVolume} onChange={this.handleVolumeValueChanged} placeholder="ltr" />
                                    </td>
                                    <td width="40%">
                                      <Input id={recordCount++} tabindex="-1" maxlength="50" size="5" type="text" name={'comments' + animaltagitem.animalTag} value={animaltagitem.comments} onChange={this.handleCommentsValueChanged} placeholder="comments" />
                                    </td>
                                  </tr>
                                 ))}
                                <tr>
                                  <th></th>
                                  <th>
                                    <FormText color="success"><strong>&nbsp;{Math.round(farmAverageMonthInMilking*100)/100}</strong></FormText>
                                  </th>
                                  <th>
                                    <FormText color="success"><b>&nbsp;{avgTotalMilkMessage}</b></FormText>
                                  </th>
                                  <th>
                                    <FormText color="success"><b>&nbsp;{previousTotalMilkMessage}</b></FormText>
                                  </th>
                                  <th>
                                    <FormText color="success"><b>&nbsp;{totalMilkMessage}</b></FormText>
                                  </th>
                                  <th></th>
                                </tr> 
                             </tbody>
                           </Table>
                           </Col>
                          </FormGroup>
                          <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleAdd}><i className={addOrUpdate === "Add" ? "fa fa-plus": "fa fa-pencil"}></i>{' ' + addOrUpdate}</Button>
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

export default AddFarmDailyMilk;
