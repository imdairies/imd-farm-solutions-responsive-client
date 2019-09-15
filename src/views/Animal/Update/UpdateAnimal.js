import React, { Component} from 'react';

import {
  Button, Card, CardBody, CardFooter, CardHeader, Col, Fade, Form,
  FormGroup, FormText, Input, Row,
  Label,  Dropdown, DropdownToggle, DropdownMenu, Table, DropdownItem,
  UncontrolledCarousel,
} from 'reactstrap';
// import ViewMilking  from '../Milking/View';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities'

const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')


var images = [];
var data1 = [];
var data2 = [];
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';


var mainChart = {
  labels: [],
  datasets: [
    {
      label: 'Target Wt (Kgs)',
      backgroundColor: 'transparent',
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1
    },
    {
      label: 'Actual Wt (Kgs)',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#eee',
      borderWidth: 2,
      data: data2
    },
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
    display: true,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 30,
          stepSize: 10,
          min: 0,
        },
      }],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
//          stepSize: Math.ceil(250 / 5),
          stepSize: Math.ceil(50),
          max: 650,
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
      eventMessageColor: "muted",
      month1MilkingRecord: [],
      month1Date: "",
      month2Date: "",
      month2MilkingRecord: [],
      genericMessage1: "Processing ...",
      genericMessage2: "Processing ...",
      feedCohort: "",
      planAnalysisComments: "",
      weightGraphMessageColor: "success", 
      weightGraphMessage: "", 
      alertList: [],
      warningList: [], 
      infoList: [],
      progneyList: [],
      progneyMessageColor: "",
      progneyMessage: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);   
    this.handleLifecycleStage = this.handleLifecycleStage.bind(this); 
    this.handleSireChange = this.handleSireChange.bind(this);
    this.loadMilkingData = this.loadMilkingData.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.retrieveAnimallWeightGraphData = this.retrieveAnimallWeightGraphData.bind(this);
    this.retrieveAnimalAdvisement = this.retrieveAnimalAdvisement.bind(this);
    this.retrieveAnimalProgney = this.retrieveAnimalProgney.bind(this);

  }



retrieveAnimallWeightGraphData(animalTag){
  fetch(API_PREFIX+ '/imd-farm-management/animals/getgrowthdata', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "animalTag": animalTag 
    })
  })
  .then(response => response.json())
  .then(responseJson => {
    if (responseJson.error) {
       this.setState({weightGraphMessageColor: "danger", weightGraphMessage: "Error in retrieving weight information: " + responseJson.message});
    }
    else {
       mainChart.labels = responseJson[0].ageInDays;
       mainChart.datasets[0].data = responseJson[0].idealWeight;
       mainChart.datasets[1].data = responseJson[0].actualWeight;
       mainChartOpts.scales.yAxes = [{ ticks: {
                                    beginAtZero: true,
                                    maxTicksLimit: 5,
                                    stepSize: 50,
                                    max: responseJson[0].largestYAxisValue,
                                    min: 0,
                                  },
                                }];
       this.setState({ageInDays: responseJson[0].ageInDays, idealWeight:responseJson[0].idealWeight, actualWeight:responseJson[0].actualWeight});
    }
  })
  .catch(error => this.setState({weightGraphMessageColor: "danger", weightGraphMessage: "Error in retrieving weight information: " + error.toString()}));
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
    images = [];
    const parsed = queryString.parse(this.props.location.search);
    this.setState({animalTag: parsed.animalTag, lifecycleStageList: [], orgID: parsed.orgID, invalidAccess: (parsed.animalTag ? false : true)});
    this.setState({month1MilkingRecord: [], month2MilkingRecord: [], genericMessage1: "Processing...",genericMessage2: "Processing..."}); 
    this.setState({items: [], eventlist: [], isLoaded: false, genericMessage: "Processing...", eventAdditionalMessage: "Loading events ..."}); 

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
    
   // alert(API_PREFIX);
    fetch(API_PREFIX + '/imd-farm-management/animals/search', {
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
                        animalType: responseJson[0].animalTypeCD,
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
    fetch(API_PREFIX+ '/imd-farm-management/lookupvalues/search', {
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
    fetch(API_PREFIX+ '/imd-farm-management/animals/retrieveaisire', {
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
    fetch(API_PREFIX+ '/imd-farm-management/animalevent/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": parsed.animalTag
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({eventlist: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({eventlist: responseJson, isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? responseJson.length + " life time event found" : responseJson.length + " life time events found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));


  // Feed Analysis
    this.setState({feedCohort: "Undetermined"}); 
    fetch(API_PREFIX+ '/imd-farm-management/feed/determineanimalfeed', {
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
         this.setState({feedAnalysisMessage: responseJson.message, feedAnalysisMessageColor: "danger"});
      }
      else {
         this.setState({feedCohort: responseJson[0].animalFeedCohortDeterminatationMessage,
                        feedCohortTypeShortDescr: responseJson[0].feedCohortTypeShortDescr,
                        planAnalysisComments: responseJson[0].planAnalysisComments,
                        nutritionalNeedsDryMatter: responseJson[0].nutritionalNeedsDryMatter,
                        nutritionalNeedsCrudeProtein: responseJson[0].nutritionalNeedsCrudeProtein,
                        nutritionalNeedsTDN: responseJson[0].nutritionalNeedsTDN,
                        nutritionalNeedsMetabloizableEnergy: responseJson[0].nutritionalNeedsMetabloizableEnergy,
                        feedAnalysisMessage: "", feedAnalysisMessageColor: "success"});         
      }
    })
    .catch(error => this.setState({feedAnalysisMessage: error.toString(), feedAnalysisMessageColor: "danger"}));




    this.setState({previousMonth: previousDate.getMonth()+1, previousYear: previousDate.getFullYear(), nextMonth: nextDate.getMonth()+1, nextYear: nextDate.getFullYear()});
    this.loadMilkingData(prevDate, recordDate, parsed.animalTag);
    this.setState({previousDate: previousDate, nextDate: nextDate});
    this.retrieveAnimallWeightGraphData(parsed.animalTag);
    this.retrieveAnimalAdvisement(parsed.animalTag);
    this.retrieveAnimalProgney(parsed.animalTag);
  }


  retrieveAnimalAdvisement(animalTag) {
      fetch(API_PREFIX+ '/imd-farm-management/advisement/retrieveanimaladvisement', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag":animalTag,
            "advisementID":"%",
            "threshold1Violated": true,
            "threshold2Violated": true,
            "threshold3Violated": true
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({alertList: []});
        }
        else {
          // this.setState({alertList: responseJson, warningList: responseJson, infoList: responseJson});
          let th1List = [];
          let th2List = [];
          let th3List = [];
          //alert(responseJson[0].animalTags)    
          for (let i=0; i< responseJson.length; i++) {
            let item = responseJson[i];
            if (item.severityThreshold === "THRESHOLD1") {
              th1List.push(item);
            } else if (item.severityThreshold === "THRESHOLD2") {
              th2List.push(item);
            } else if (item.severityThreshold === "THRESHOLD3") {
              th3List.push(item);
            }
          }

          if (th1List.length === 0 && th2List.length === 0 && th3List.length === 0)
            th1List.push({ruleOutcomeMessage: "You seem to be managing this animal well. There are no special instructions pertainig to this animal.", ruleOutcomeShortMessage:"You seem to be managing this animal well. There is no special instructions pertainig to this animal.", animalTags:"", advisementRule: "THUMBSUP"});

          this.setState({alertList: th3List, warningList: th2List, infoList: th1List});
          }
        })
  }


  retrieveAnimalProgney(animalTag) {
      fetch(API_PREFIX+ '/imd-farm-management/animals/retrieveprogney', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag":animalTag
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({progneyList: [],progneyMessage: responseJson.message, progneyMessageColor: "danger"});
        }
        else {
          this.setState({progneyList: responseJson, progneyMessage: "", progneyMessageColor: "success"});
          }
        })
    .catch(error => this.setState({progneyMessage: "Following error occurred while processing the request: " + error.toString(), progneyMessageColor: "danger"}));
  }
  loadMilkingData(prevDate, recordDate, animalTag){
    // milking information month 1
    fetch(API_PREFIX+ '/imd-farm-management/animals/monthlymilkingrecord', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": animalTag,
          "milkingDateStr": prevDate.getFullYear() + '-' + (prevDate.getMonth()+1) + '-01',
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
    fetch(API_PREFIX+ '/imd-farm-management/animals/monthlymilkingrecord', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": animalTag,
          "milkingDateStr": recordDate.getFullYear() + '-' + (recordDate.getMonth()+1) + '-01',
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


  handleLifecycleStage(event) {
    this.setState({animalType: event.target.value});
  }


  handleSireChange(event) {
    this.setState({animalSireAlias: this.state.sireList[event.target.value].alias, animalSireURL: this.state.sireList[event.target.value].sireDataSheet});
  }


  handleChange(event) {
    if (event.target.id === "alias")
      this.setState({alias: event.target.value});
    if (event.target.id === "shortdescription")
      this.setState({shortdescription: event.target.value});
    if (event.target.id === "longdescription")
      this.setState({longdescription: event.target.value});
    if (event.target.id === "active")
      this.setState({activeIndicator: (event.target.checked ? "Y": "N")});
  }

  handleUpdate(event) {
    event.preventDefault();
      fetch(API_PREFIX+ '/imd-farm-management/animals/updateanimal', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": this.state.animalTag,
            "alias": this.state.alias,
            "gender" : (this.state.gender === "Female" ? "F" : "M"),
            "sire" : (this.state.animalSireAlias === "-- Select Sire --"  ? null : this.state.animalSireTag),
            "dateOfBirthStr": this.state.dateOfBirth,
            "animalType": (this.state.animalType === "-- Animal Type --" ? null : this.state.animalType)
            // "eventLongDescription": longDescr,
            // "activeIndicator": active
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



  render() {
    var { progneyList, progneyMessageColor, progneyMessage, infoList, warningList, alertList, message, invalidAccess, lifecycleStageList, sireList, feedAnalysisMessageColor, feedAnalysisMessage, eventAdditionalMessage, eventMessageColor, messageColor, eventlist} = this.state;
    var { weightGraphMessageColor, weightGraphMessage, genericMessage1, genericMessage2, month1MilkingRecord, month2MilkingRecord, message1Color, message2Color} = this.state;
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
                              <Input id="alias" type="text" maxLength="75" value={this.state.alias} onChange={this.handleChange} placeholder="Animal Alias"  />
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
                <Col md="6">
                  <Card>
                      <CardHeader>
                        <i className="fa fa-align-justify"></i><strong>Progney</strong><FormText color={progneyMessageColor}>&nbsp;{progneyMessage}</FormText>
                      </CardHeader>
                      <CardBody>
                         <Table hover bordered striped responsive size="sm">
                          <thead>
                              <tr>
                                <th>Tag</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Age</th>
                              </tr> 
                          </thead>
                          <tbody>
                             {progneyList.map(item => (
                                 <tr key="{item.animalTag}">
                                   <td><Link target='_blank' to={'/animal/update?animalTag=' + item.animalTag + '&orgID=' + item.orgID} >{item.animalTag}</Link></td>
                                   <td>{item.animalType}</td>
                                   <td>{item.animalStatus}</td>
                                   <td>{item.currentAge}</td>
                               </tr>
                               ))}
                          </tbody>
                         </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md="8">
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i><strong>Advisement</strong>
                    </CardHeader>
                    <CardBody>
                    <ol>
                      {alertList.map(alertItem => (
                        <li><font color="red">{alertItem.ruleOutcomeMessage}</font></li>
                       ))}
                      {warningList.map(warningItem => (
                        <li><font color="orange">{warningItem.ruleOutcomeMessage}</font></li>
                       ))}
                      
                      {infoList.map(infoItem => (
                        <li><font color="blue">{infoItem.ruleOutcomeMessage}</font></li>
                       ))}
                      </ol>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md="8">
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i><strong>Feed Information</strong>{' (' + this.state.feedCohortTypeShortDescr + ')'}<FormText color={feedAnalysisMessageColor}>&nbsp;{feedAnalysisMessage}</FormText>
                    </CardHeader>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Col sm="10">{this.state.feedCohort}</Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col sm="10">{this.state.planAnalysisComments}</Col>                          
                        </FormGroup>
                        <FormGroup row>
                          <Col sm="10">{'The daily needs of this animal are: ' + (this.state.nutritionalNeedsDryMatter * 100 )+ 
                          '% of body weight in Dry Matter (DM), Crude protein of ' + (this.state.nutritionalNeedsCrudeProtein * 100) + 
                          ' % DM, ' + this.state.nutritionalNeedsMetabloizableEnergy + 
                          ' MJ Metabolizable Energy and ' + this.state.nutritionalNeedsTDN + ' Kgs. TDN'}</Col>                          
                        </FormGroup>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md="8">
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i><strong>Growth Information</strong><FormText color={weightGraphMessageColor}>&nbsp;{weightGraphMessage}</FormText>
                    </CardHeader>
                    <CardBody>
                      <div className="chart-wrapper" style={{ height: 450 + 'px', marginTop: 0 + 'px' }} >
                        <Line data={mainChart} options={mainChartOpts}/>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

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
                                <td colspan="5" align="center"> <button onClick={this.handlePrevious}>◀︎◀︎</button>&nbsp;&nbsp;<strong>{this.state.month1Date}</strong></td>
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
                      <FormText color={message2Color}>&nbsp;{genericMessage2}</FormText>
                      <CardBody>
                          <Row>
                            <Col>
                               <Table hover bordered striped responsive size="sm">
                                <tr>
                                  <td colspan="5" align="center"><strong>{this.state.month2Date}</strong>&nbsp;&nbsp;<button onClick={this.handleNext} >►►</button></td>
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

        <Row>
          <Col md="10">
            <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i>{"Life Events " + this.state.animalTag}<FormText color={eventMessageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                </CardHeader>
                <CardBody>
                   <Table hover bordered striped responsive size="sm">
                    <thead>
                        <tr>
                          <th>#</th>
                          <th>Timestamp</th>
                          <th>Type</th>
                          <th>Operator</th>
                          <th>Day(s) Ago</th>
                          <th>Age at Event</th>
                          <th>Comments</th>
                        </tr> 
                    </thead>
                    <tbody>
                       {eventlist.map(item => (
                           <tr key="{item.animalTag}">
                             <td>{eventlist.length - ++eventRecordCount + 1}</td>
                             <td width="10%" data-toggle="tooltip" title={item.eventTimeStamp.substring(item.eventTimeStamp.length-8).trim()}>{item.eventTimeStamp.substring(0,item.eventTimeStamp.length-8).trim()}</td>
                             <td><Link target="_blank" to={'/animal/event/update?eventTransactionID=' + item.eventTransactionID} >{item.eventShortDescription}</Link></td>
                             <td>{item.eventOperator}</td>
                             <td>{item.daysFromToday}</td>
                             <td>{item.ageWhenOccurred}</td>
                             <td width="50%">{item.eventComments + " " + item.auxField1Value + " " + item.auxField2Value}</td>
                         </tr>
                         ))}
                    </tbody>
                   </Table>
                  <CardFooter>
                    <FormText color={messageColor}>&nbsp;{message}</FormText>
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
