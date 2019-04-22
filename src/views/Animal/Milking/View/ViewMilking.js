import React, { Component } from 'react';

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
  Row,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  Table,
  DropdownItem,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import queryString from 'query-string';
import classnames from 'classnames';
import { Redirect, Link, Route } from 'react-router-dom';



class ViewMilking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: new Array(2).fill(false),
      invalidAccess: false,
      collapse: true,
      warning: false,
      fadeIn: true,
      isLoaded: false,
      timeout: 300,
      orgID : "",
      animalTag : "",
      messageColor: "muted",
      month1MilkingRecord: [],
      month1Date: "",
      month2Date: "",
      month2MilkingRecord: [],
      genericMessage1: "Processing ...",
      genericMessage2: "Processing ..."
    };
   this.handlePrevious = this.handlePrevious.bind(this);
   this.handleNext = this.handleNext.bind(this);
   this.loadMilkingData = this.loadMilkingData.bind(this);
  }

  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    var recordDate = new Date();
    var prevDate = null;
    var previousDate = null;
    var nextDate = null;
    var recYear = (parsed.recYear ? parsed.recYear : recordDate.getFullYear() );
    var recMonth = (parsed.recMonth  ? parsed.recMonth : recordDate.getMonth()+1);

    if (parsed.recYear && parsed.recMonth) {
      recordDate = new Date(recYear, recMonth, 1);
    }

    prevDate = new Date(recordDate);
    prevDate.setMonth(recordDate.getMonth() - 1);
    previousDate = new Date(prevDate);
    previousDate.setMonth(previousDate.getMonth()-1);

    nextDate = new Date(recordDate);
    nextDate.setMonth(nextDate.getMonth()+1);

    this.setState({animalTag: parsed.animalTag, orgID: parsed.orgID, invalidAccess: (parsed.animalTag ? false : true)});
    this.setState({month1MilkingRecord: [], month2MilkingRecord: [], isLoaded: false, genericMessage1: "Processing...",genericMessage2: "Processing..."}); 
    this.setState({month1Date : prevDate.toLocaleString('en-us', { month: 'short'}) + " " + prevDate.getFullYear(), month2Date: recordDate.toLocaleString('en-us', { month: 'short'}) + " " + recordDate.getFullYear()});
    this.setState({previousMonth: previousDate.getMonth()+1, previousYear: previousDate.getFullYear(), nextMonth: nextDate.getMonth()+1, nextYear: nextDate.getFullYear()});
    this.loadMilkingData(prevDate, recordDate, parsed.animalTag);
    this.setState({previousDate: previousDate, nextDate: nextDate});

  }
  loadMilkingData(prevDate, recordDate, animalTag){
    // milking information month 1
    fetch('http://localhost:8080/imd-farm-management/animals/monthlymilkingrecord', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": animalTag,
          "milkingDateStr": prevDate.getFullYear() + "-" + (prevDate.getMonth()+1) + "-" + "01"
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({month1MilkingRecord: [], isLoaded: true, genericMessage1: "Following error occurred while processing the request: " + responseJson.message, message1Color: "danger"});
      }
      else {
         this.setState({month1MilkingRecord: responseJson, isLoaded: true, genericMessage1: (responseJson.length === 1 ? responseJson.length + " record found" : responseJson.length + " records found"), message1Color: "success"});         
      }
    })
    .catch(error => this.setState({genericMessage1: "Following error occurred while processing the request: " + error.toString(), message1Color: "danger"}));

    // milking information month 2
    fetch('http://localhost:8080/imd-farm-management/animals/monthlymilkingrecord', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": animalTag,
          "milkingDateStr": recordDate.getFullYear() + "-" + (recordDate.getMonth()+1) + "-" + "01"
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({month2MilkingRecord: [], isLoaded: true, genericMessage2: "Following error occurred while processing the request: " + responseJson.message, message2Color: "danger"});
      }
      else {
         this.setState({month2MilkingRecord: responseJson, isLoaded: true, genericMessage2: (responseJson.length === 1 ? responseJson.length + " record found" : responseJson.length + " records found"), message2Color: "success"});         
      }
    })
    .catch(error => this.setState({genericMessage2: "Following error occurred while processing the request: " + error.toString(), message2Color: "danger"}));

  }

  handlePrevious(event) {
    let recordDate = this.state.previousDate;
    let prevDate = null;
    let previousDate = null;
    let nextDate = null;

    recordDate.setMonth(recordDate.getMonth()+1);

    prevDate = new Date(recordDate);
    prevDate.setMonth(recordDate.getMonth() - 1);
    previousDate = new Date(prevDate);
    previousDate.setMonth(previousDate.getMonth()-1);

    nextDate = new Date(recordDate);
    nextDate.setMonth(nextDate.getMonth()+1);

    this.setState({month1MilkingRecord: [], month2MilkingRecord: [], isLoaded: false, genericMessage: "Processing..."}); 
    this.setState({month1Date : prevDate.toLocaleString('en-us', { month: 'short'}) + " " + prevDate.getFullYear(), month2Date: recordDate.toLocaleString('en-us', { month: 'short'}) + " " + recordDate.getFullYear()});
    this.setState({previousMonth: previousDate.getMonth()+1, previousYear: previousDate.getFullYear(), nextMonth: nextDate.getMonth()+1, nextYear: nextDate.getFullYear()});
    this.loadMilkingData(prevDate, recordDate,this.state.animalTag);
    this.setState({previousDate: previousDate, nextDate: nextDate});
  }

  handleNext() {
    let recordDate = this.state.nextDate;
    let prevDate = null;
    let previousDate = null;
    let nextDate = null;

    prevDate = new Date(recordDate);
    prevDate.setMonth(recordDate.getMonth() - 1);
    previousDate = new Date(prevDate);
    previousDate.setMonth(previousDate.getMonth()-1);

    nextDate = new Date(recordDate);
    nextDate.setMonth(nextDate.getMonth()+1);

    this.setState({month1MilkingRecord: [], month2MilkingRecord: [], isLoaded: false, genericMessage: "Processing..."}); 
    this.setState({month1Date : prevDate.toLocaleString('en-us', { month: 'short'}) + " " + prevDate.getFullYear(), month2Date: recordDate.toLocaleString('en-us', { month: 'short'}) + " " + recordDate.getFullYear()});
    this.setState({previousMonth: previousDate.getMonth()+1, previousYear: previousDate.getFullYear(), nextMonth: nextDate.getMonth()+1, nextYear: nextDate.getFullYear()});
    // milking information month 1
   this.loadMilkingData(prevDate, recordDate, this.state.animalTag);
    this.setState({previousDate: previousDate, nextDate: nextDate});
  }


  render() {
    var { invalidAccess, genericMessage1, genericMessage2, month1MilkingRecord, month2MilkingRecord, message1Color, message2Color} = this.state;
    let recordCount = 0;
    let eventRecordCount = 0;
    // if (invalidAccess)
    //   return (<Redirect to='/animal/search'  />);
    return (
      <div className="animated fadeIn">
        <Nav tabs>
          <NavItem>
            <NavLink id="view-tab" className={classnames({ active: true })}  onClick={this.handleTabClick("view-tab")} >
               <Link to={'/animal/milking/search'}><i className="fa fa-search"></i></Link>{' '}<strong>View</strong>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink id="add-tab" className={classnames({ active: false })} onClick={this.handleTabClick("add-tab")} >
             <Link to={'/animal/milking/add'}><i className="fa fa-plus"></i></Link><strong>{' '}Add</strong>
            </NavLink>
          </NavItem>
        </Nav>

        <Row size="sm">
          <Col md="8">
            <Card>
              <CardHeader><strong>Milk Information # {this.state.animalTag}</strong></CardHeader>
              <CardBody>
                <Row>
                  <Col sm="6">
                    <Card>
                      <FormText color={message1Color}>&nbsp;{genericMessage1}</FormText>
                      <CardBody>
                          <Row>
                            <Col>
                             <Table hover bordered striped responsive size="sm">
                              <tr>
                                <td colspan="5" align="center"> <a onClick={this.handlePrevious}><u>&lt;&lt;</u></a>&nbsp;&nbsp;<strong>{this.state.month1Date}</strong></td>
                              </tr> 
                              <tr>
                                <th>Day</th>
                                <th>1</th>
                                <th>2</th>
                                <th>3</th>
                                <th>Total</th>
                              </tr> 
                               <tbody>
                                 {month1MilkingRecord.map(milkingDayRec => (
                                     <tr key="{milkingDayRec.milkingDate}">
                                       <td>{milkingDayRec.milkingDate}</td>
                                       <td title={milkingDayRec.event1Time + ", " + milkingDayRec.event1Temperature + " °C, " + milkingDayRec.event1Humidity + "%\n" + milkingDayRec.event1Comments}>{milkingDayRec.milkVol1}</td>
                                       <td title={milkingDayRec.event2Time + ", " +milkingDayRec.event2Temperature + " °C, " + milkingDayRec.event2Humidity + "%\n" + milkingDayRec.event2Comments}>{milkingDayRec.milkVol2}</td>
                                       <td title={milkingDayRec.event3Time + ", " +milkingDayRec.event3Temperature + " °C, " + milkingDayRec.event3Humidity + "%\n" + milkingDayRec.event3Comments}>{milkingDayRec.milkVol3}</td>
                                       <td>{milkingDayRec.milkVol1 + milkingDayRec.milkVol2 + milkingDayRec.milkVol3}</td>                                       
                                   </tr>
                                   ))}
                               </tbody>

                             </Table>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm="6">
                    <Card>
                      <FormText color={message2Color}>&nbsp;{genericMessage2}</FormText>
                      <CardBody>
                          <Row>
                            <Col>
                               <Table hover bordered striped responsive size="sm">
                                <tr>
                                  <td colspan="5" align="center"><strong>{this.state.month2Date}</strong>&nbsp;&nbsp;<a onClick={this.handleNext} ><u>&gt;&gt;</u></a></td>
                                </tr> 
                                <tr>
                                  <th>Day</th>
                                  <th>1</th>
                                  <th>2</th>
                                  <th>3</th>
                                  <th>Total</th>
                                </tr> 
                               <tbody>
                                 {month2MilkingRecord.map(milkingDayRec => (
                                     <tr key="{milkingDayRec.milkingDate}">
                                       <td>{milkingDayRec.milkingDate}</td>
                                       <td title={milkingDayRec.event1Time + ", " + milkingDayRec.event1Temperature + " °C, " + milkingDayRec.event1Humidity + "%\n" + milkingDayRec.event1Comments}>{milkingDayRec.milkVol1}</td>
                                       <td title={milkingDayRec.event2Time + ", " +milkingDayRec.event2Temperature + " °C, " + milkingDayRec.event2Humidity + "%\n" + milkingDayRec.event2Comments}>{milkingDayRec.milkVol2}</td>
                                       <td title={milkingDayRec.event3Time + ", " +milkingDayRec.event3Temperature + " °C, " + milkingDayRec.event3Humidity + "%\n" + milkingDayRec.event3Comments}>{milkingDayRec.milkVol3}</td>
                                       <td>{milkingDayRec.milkVol1 + milkingDayRec.milkVol2 + milkingDayRec.milkVol3}</td>                                       
                                   </tr>
                                   ))}
                               </tbody>

                             </Table>
                          </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ViewMilking;
