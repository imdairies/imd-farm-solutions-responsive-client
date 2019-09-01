import React, { Component } from 'react';
import { Bar, Line } from 'react-chartjs-2';


import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
var data1 = [];
var data2 = [];
var data3 = [];
const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';


var mainChart = {
  labels: [],
  datasets: [
    {
      label: 'ltr/day',
      backgroundColor: hexToRgba(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1
    },
    {
      label: 'month avg',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data2
    },
    // {
    //   label: 'Milk Volume',
    //   backgroundColor: 'transparent',
    //   borderColor: brandDanger,
    //   pointHoverBackgroundColor: '#fff',
    //   borderWidth: 1,
    //   borderDash: [8, 5],
    //   data: data3
    //   // data: [],
    // },
  ],
};


var mainChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips,
    intersect: true,
    mode: 'index',
    position: 'nearest',
    callbacks: {
      labelColor: function(tooltipItem, chart) {
        return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
      }
    }
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false,
        },
      }],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
//          stepSize: Math.ceil(250 / 5),
          stepSize: Math.ceil(2),
          max: 40,
          min: 0,
        },
      }],
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
};

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
    let now =  new Date();
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
    var max1 = 0.0;
    var sum1 = 0.0;
    var dayVolume1 = 0.0;
    var average1 = 0.0;

    var max2 = 0.0;
    var sum2 = 0.0;
    var dayVolume2 = 0.0;
    var average2 = 0.0;

    this.setState({month1MilkingRecord: [], month1Sum: sum1, month1Max: max1, month1Avg: average1, isLoaded: false, genericMessage1: ""});
    this.setState({month2MilkingRecord: [], month2Sum: sum2, month2Max: max2, month2Avg: average2, isLoaded: false, genericMessage2: ""});
    // milking information month 1
    fetch(API_PREFIX + '/imd-farm-management/animals/monthlymilkingrecord', {
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
        for (let i = 0; i<responseJson.length; i++) {
          dayVolume1 = (responseJson[i].milkVol1 === "" ? 0 : responseJson[i].milkVol1) + (responseJson[i].milkVol2 === "" ? 0 : responseJson[i].milkVol2) + (responseJson[i].milkVol3 === "" ? 0 : responseJson[i].milkVol3);
          sum1 = sum1 + dayVolume1;
          if (dayVolume1 > max1) 
            max1 = dayVolume1;
        }
        average1 = Math.round((sum1 / responseJson.length)*100)/100;
        this.setState({month1MilkingRecord: responseJson, month1Sum: sum1, month1Max: max1, month1Avg: average1, isLoaded: true, genericMessage1: (responseJson.length === 1 ? responseJson.length + " record found" : responseJson.length + " records found"), message1Color: "success"});
      }
    })
    .catch(error => this.setState({genericMessage1: "Following error occurred while processing the request: " + error.toString(), message1Color: "danger"}));


    // milking information month 2
    fetch(API_PREFIX + '/imd-farm-management/animals/monthlymilkingrecord', {
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
        for (let i = 0; i<responseJson.length; i++) {
          dayVolume2 = (responseJson[i].milkVol1 === "" ? 0 : responseJson[i].milkVol1) + (responseJson[i].milkVol2 === "" ? 0 : responseJson[i].milkVol2) + (responseJson[i].milkVol3 === "" ? 0 : responseJson[i].milkVol3);
          sum2 = sum2 + dayVolume2;
          if (dayVolume2 > max2) 
            max2 = dayVolume2;
        }
        // average = Math.round(((sum / responseJson.length)*10)/10);
        average2 = Math.round((sum2 / responseJson.length)*100)/100;
        this.setState({month2MilkingRecord: responseJson, month2Sum: sum2, month2Max: max2, month2Avg: average2, isLoaded: true, genericMessage2: (responseJson.length === 1 ? responseJson.length + " record found" : responseJson.length + " records found"), message2Color: "success"});
        // this.setState({month2MilkingRecord: responseJson, isLoaded: true, genericMessage2: (responseJson.length === 1 ? responseJson.length + " record found" : responseJson.length + " records found"), message2Color: "success"});         
      }
    })
    .catch(error => this.setState({genericMessage2: "Following error occurred while processing the request: " + error.toString(), message2Color: "danger"}));


    fetch(API_PREFIX + '/imd-farm-management/milkinginfo/milkingrecordofananimalforspecifiedmonthpair', {
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
           this.setState({genericMessage: responseJson.message});
        }
        else {
          let averageMonth = [];
          let day = 0;
          let secondMonth = false;
           for (let i = 0; i< responseJson[0].volumes.length; i++){
              if (day > responseJson[0].days[i]) {
                secondMonth = true;
              } else {
                day = responseJson[0].days[i];
              }
             averageMonth.push(secondMonth ? average2: average1);
           }
           mainChart.labels = responseJson[0].days;
           mainChart.datasets[0].data = responseJson[0].volumes;
           mainChart.datasets[1].data = averageMonth;
           //mainChart.datasets[1].data = responseJson[0].volumes;
           mainChartOpts.scales.yAxes = [{ ticks: {
                                        beginAtZero: true,
                                        maxTicksLimit: 5,
                                        stepSize: 5,
                                        max: 40,
                                        min: 0,
                                      },
                                    }];
           this.setState({monthVolumes: responseJson[0].volumes, monthDays:responseJson[0].days});

        }
      })
      .catch(error => this.setState({genericMessage: (error.toString().indexOf("Failed to fetch") >= 0 ? "Server Connection Error" : error.toString())}));


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
    var { previousPreviousMonth, previsousMonth, currentMonth, currentYear, invalidAccess, genericMessage1, genericMessage2, month1MilkingRecord, month2MilkingRecord, message1Color, message2Color} = this.state;
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
                    <Col>
                      <Card>
                        <CardBody>
                          <Row>
                            <Col sm="5">
                              <CardTitle className="mb-0">{this.state.chartTitle}</CardTitle>
                              <div className="small text-muted">{this.state.chartSubTitle}</div>
                            </Col>
                          </Row>
                        <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                          <Line data={mainChart} options={mainChartOpts} height={300} />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col sm="6">
                    <Card>
                      <FormGroup><strong>Total:</strong> {this.state.month1Sum}, <strong>Max:</strong> {this.state.month1Max}, <strong>Avg:</strong> {this.state.month1Avg}</FormGroup>
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
                                       <td>{(milkingDayRec.milkVol1==="" ? 0:milkingDayRec.milkVol1) + (milkingDayRec.milkVol2  === "" ? 0 : milkingDayRec.milkVol2) + (milkingDayRec.milkVol3 === "" ? 0 : milkingDayRec.milkVol3)}</td>                                       
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
                      <FormGroup><strong>Total:</strong> {this.state.month2Sum}, <strong>Max:</strong> {this.state.month2Max}, <strong>Avg:</strong> {this.state.month2Avg}</FormGroup>
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
                                       <td>{(milkingDayRec.milkVol1==="" ? 0:milkingDayRec.milkVol1) + (milkingDayRec.milkVol2  === "" ? 0 : milkingDayRec.milkVol2) + (milkingDayRec.milkVol3 === "" ? 0 : milkingDayRec.milkVol3)}</td>                                       
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
