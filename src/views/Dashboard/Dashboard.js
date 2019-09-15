import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardTitle,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
import { Link } from 'react-router-dom';

const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')


var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';







var herdSizeHistoryOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};



// Main Chart



// Card Chart 3


  var data1 = [];
  var data2 = [];


  // for (var i = 0; i <= elements; i++) {
  //   data1.push(random(10, 24));
  //   data2.push(random(10, 24));
  //   data3.push(18);
  // }

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
      label: 'avg/animal',
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
          stepSize: Math.ceil(500 / 100),
          max: 400,
          min: 300,
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

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.loadCurrentYearData = this.loadCurrentYearData.bind(this);
    this.loadCurrentMonthData = this.loadCurrentMonthData.bind(this);
    this.retrieveLactatingCount = this.retrieveLactatingCount.bind(this);
    this.retrieveHeiferCount = this.retrieveHeiferCount.bind(this);
    this.retrieveFemaleCalvesCount = this.retrieveFemaleCalvesCount.bind(this);
    this.retrieveHerdSizeHistory = this.retrieveHerdSizeHistory.bind(this);
    this.retrieveMilkingRecordOfMonth = this.retrieveMilkingRecordOfMonth.bind(this);

    this.state = {
      dropdownOpen: false,
      radioSelected: 3,
      monthDays:[],
      monthVolumes:[],
      monthAverages:[],
      herdSize: -999,
      lactatingAnimalCount: -999,
      heiferCount: -999,
      femaleCalfCount:-999,
      bullCount:3,
      pregnantCount: -999,
      activeAnimalWidgetMessage: "",
      lactatingAnimalWidgetMessage: "",
      chartTitle: "Daily Milk Production",
      previsousMonth: "",
      previsousMonthYear: "",
      previousPreviousMonth : "", 
      previsousPreviousMonthYear: "",
      currentMonth: "",
      currentYear: "",
      chartSubTitle: new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long' }).format(new Date())
    };

    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    this.state.currentYear = year;
    this.state.previsousMonthYear = year;
    this.state.previsousPreviousMonthYear = year;
    if (month === 0) {
      this.state.currentMonth = "Jan";
      this.state.previsousMonth = "Dec";
      this.state.previousPreviousMonth = "Nov";
      this.state.previsousMonthYear = year -1;
      this.state.previsousPreviousMonthYear = year -1;
    } else if (month === 1) {
      this.state.currentMonth = "Feb";
      this.state.previsousMonth = "Jan";
      this.state.previousPreviousMonth = "Dec";
      this.state.previsousPreviousMonthYear = year -1;
    } else if (month === 2) {
      this.state.currentMonth = "Mar";
      this.state.previsousMonth = "Feb";
      this.state.previousPreviousMonth = "Jan";
    } else if (month === 3) {
      this.state.currentMonth = "Apr";
      this.state.previsousMonth = "Mar";
      this.state.previousPreviousMonth = "Feb`";
    } else if (month === 4) {
      this.state.currentMonth = "May";
      this.state.previsousMonth = "Apr";
      this.state.previousPreviousMonth = "Mar";
    } else if (month === 5) {
      this.state.currentMonth = "Jun";
      this.state.previsousMonth = "May";
      this.state.previousPreviousMonth = "Apr";
    } else if (month === 6) {
      this.state.currentMonth = "Jul";
      this.state.previsousMonth = "Jun";
      this.state.previousPreviousMonth = "May";
    } else if (month === 7) {
      this.state.currentMonth = "Aug";
      this.state.previsousMonth = "Jul";
      this.state.previousPreviousMonth = "Jun";
    } else if (month === 8) {
      this.state.currentMonth = "Sep";
      this.state.previsousMonth = "Aug";
      this.state.previousPreviousMonth = "Jul";
    } else if (month === 9) {
      this.state.currentMonth = "Oct";
      this.state.previsousMonth = "Sep";
      this.state.previousPreviousMonth = "Aug";
    } else if (month === 10) {
      this.state.currentMonth = "Nov";
      this.state.previsousMonth = "Oct";
      this.state.previousPreviousMonth = "Sep";
    } else if (month === 11) {
      this.state.currentMonth = "Dec";
      this.state.previsousMonth = "Nov";
      this.state.previousPreviousMonth = "Oct";
    }

  }

  componentDidMount() {

      this.retrieveActiveHerdCount();
      this.retrieveLactatingCount();
      this.retrievePregnantCount();
      this.retrieveHerdSizeHistory();
      this.retrieveMilkingRecordOfMonth();

      // this.retrieveHeiferCount();
      // this.retrieveFemaleCalvesCount();
   }

retrieveActiveHerdCount(){
  fetch(API_PREFIX+ '/imd-farm-management/animals/allactive')
  .then(response => response.json())
  .then(responseJson => {
    if (responseJson.error) {
      this.setState({herdSize: -999, activeAnimalWidgetMessage: "Error in retrieving active herd size: " + responseJson.message});
    }
    else {
       this.setState({herdSize: responseJson.length,  activeAnimalWidgetMessage: ""});
    }
  })
  .catch(error => this.setState({herdSize: -999,  activeAnimalWidgetMessage: (error.toString().indexOf("Failed to fetch") >= 0 ? "Server Connection Error" : "Error in retrieving active herd size: " + error.toString())}));

}

retrieveMilkingRecordOfMonth(){
  let now =  new Date();
  fetch(API_PREFIX+ '/imd-farm-management/milkinginfo/milkingrecordofmonth', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "milkingDateStr": now.getFullYear() + "-" + (now.getMonth()+1) + "-1" 
    })
  })
  .then(response => response.json())
  .then(responseJson => {
  if (responseJson.error) {
     this.setState({lactatingAnimalCount: -999, lactatingAnimalWidgetMessage:  "Error in retrieving milking record: " + responseJson.message});
  }
  else {
     mainChart.labels = responseJson[0].days;
     mainChart.datasets[0].data = responseJson[0].volumes;
     mainChart.datasets[1].data = responseJson[0].averages;
     mainChartOpts.scales.yAxes = [{ ticks: {
                                  beginAtZero: true,
                                  maxTicksLimit: 5,
                                  stepSize: 25,
                                  max: 400,
                                  min: 150,
                                },
                              }];
     this.setState({monthVolumes: responseJson[0].volumes, monthDays:responseJson[0].days});
  }
  })
  .catch(error => this.setState({lactatingAnimalCount: -999,  lactatingAnimalWidgetMessage: (error.toString().indexOf("Failed to fetch") >= 0 ? "Server Connection Error" :  "Error in retrieving milking record: " + error.toString())}));

}

retrievePregnantCount(){
  fetch(API_PREFIX+ '/imd-farm-management/animals/pregnantcows', {
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
     this.setState({pregnantCount: -999, lactatingAnimalWidgetMessage:  "Error in retrieving active pregnant count: " + responseJson.message});
  }
  else {
     this.setState({pregnantCount: responseJson.length,  pregnantAnimalWidgetMessage: "Pregnant Herd"});         
  }
  })
  .catch(error => this.setState({pregnantCount: -999,  pregnantAnimalWidgetMessage: (error.toString().indexOf("Failed to fetch") >= 0 ? "Server Connection Error" :   "Error in retrieving active pregnant count: " + error.toString())}));


}

retrieveHeiferCount(){
  fetch(API_PREFIX+ '/imd-farm-management/animals/heifers', {
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
     this.setState({heiferCount: -999, heiferWidgetMessage:  "Error in retrieving active heifer count: " + responseJson.message});
  }
  else {
     this.setState({heiferCount: responseJson.length,  heiferWidgetMessage: "Heifers"});         
  }
  })
  .catch(error => this.setState({heiferCount: -999,  heiferWidgetMessage: (error.toString().indexOf("Failed to fetch") >= 0 ? "Server Connection Error" :  "Error in retrieving active heifer count: " + error.toString())}));

}

retrieveFemaleCalvesCount(){

  fetch(API_PREFIX+ '/imd-farm-management/animals/femalecalves', {
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
     this.setState({femaleCalfCount: -999, femaleCalfWidgetMessage:  "Error in retrieving active female calves count: " + responseJson.message});
  }
  else {
     this.setState({femaleCalfCount: responseJson.length,  femaleCalfWidgetMessage: "Female Progney"});         
  }
  })
  .catch(error => this.setState({femaleCalfCount: -999,  femaleCalfWidgetMessage: (error.toString().indexOf("Failed to fetch") >= 0 ? "Server Connection Error" :  "Error in retrieving active female calves count: " + error.toString())}));
}

retrieveHerdSizeHistory(){
  let now =  new Date();
  let herdSizeHistory = {
    datasets: [
      {
        label: 'Active Herd Size',
        backgroundColor: 'rgba(255,255,255,.5)',
        borderColor: 'rgba(255,255,255,0.55)',
        // data: [0,2,46,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,0,64,66,68,70,72],
      },
    ],
  };
  // this.setState({herdSizeTrend: herdSizeHistory});
  // background graph that shows herd size growth trend
  fetch(API_PREFIX+ '/imd-farm-management/farm/herdsizehistory', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "start": "2017-01-31",
        "end": now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate(),
        "steps": 1
    })
  })
  .then(response => response.json())
  .then(responseJson => {
  if (responseJson.error) {
    this.setState({herdSize: -999, activeAnimalWidgetMessage:  "Error in retrieving herd size history: " + responseJson.message});
  }
  else {
    // alert(responseJson.months);
    herdSizeHistory.labels = responseJson.months;
    herdSizeHistory.datasets[0].data = responseJson.herdCounts;
    this.setState({herdSizeTrend: herdSizeHistory});
  }
  })
  .catch(error => this.setState({herdSize: -999,  activeAnimalWidgetMessage: (error.toString().indexOf("Failed to fetch") >= 0 ? "Server Connection Error" :  "Error in retrieving herd size history: " + error.toString())}));


}

retrieveLactatingCount() {

  fetch(API_PREFIX+ '/imd-farm-management/animals/lactatingcows', {
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
     this.setState({lactatingAnimalCount: -999, lactatingAnimalWidgetMessage:  "Error in retrieving active lactating count: " + responseJson.message});
  }
  else {
     this.setState({lactatingAnimalCount: responseJson.length,  lactatingAnimalWidgetMessage: "Lactating Herd"});         
  }
  })
  .catch(error => this.setState({lactatingAnimalCount: -999,  lactatingAnimalWidgetMessage: (error.toString().indexOf("Failed to fetch") >= 0 ? "Server Connection Error" :  "Error in retrieving active lactating count: " + error.toString())}));
}



  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
    if (radioSelected === 1) {
      this.loadPreviousPreviousMonthData();
    } else if (radioSelected === 2) {
      this.loadPreviousMonthData();
    } else if (radioSelected === 3) {
      this.loadCurrentMonthData();
    } else if (radioSelected === 4) {
      this.loadCurrentYearData();
    }
  }
  loadCurrentMonthData(){
      let now =  new Date();
      fetch(API_PREFIX+ '/imd-farm-management/milkinginfo/milkingrecordofmonth', {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "milkingDateStr": now.getFullYear() + "-" + (now.getMonth()+1) + "-1" 
            })
          })
       .then(response => response.json())
        .then(responseJson => {
          if (responseJson.error) {
             this.setState({lactatingAnimalCount: -999, lactatingAnimalWidgetMessage: responseJson.message});
          }
          else {
              mainChart.labels = responseJson[0].days;
              mainChart.datasets[0].data = responseJson[0].volumes;
              mainChart.datasets[1].data = responseJson[0].averages;
             this.setState({monthVolumes: responseJson[0].volumes,
              monthDays:responseJson[0].days,
              monthAverages: responseJson[0].averages,
              chartTitle: "Daily Milk Production",
              chartSubTitle: new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long' }).format(new Date())
              });
          }
        })
        .catch(error => this.setState({lactatingAnimalCount: -999,  lactatingAnimalWidgetMessage: error.toString()}));
  }
  loadPreviousMonthData(){
      let now =  new Date();
      let prevMonth = now.getMonth()+1; // getMonth() returns months in the range of 0-11
      let prevYear = this.state.previsousMonthYear;
      if (prevMonth === 1 /*Jan*/) {
        prevMonth  = 12;
      } else {
        prevMonth --;
      }

      fetch(API_PREFIX+ '/imd-farm-management/milkinginfo/milkingrecordofmonth', {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "milkingDateStr": prevYear + "-" + prevMonth + "-1" 
            })
          })
       .then(response => response.json())
        .then(responseJson => {
          if (responseJson.error) {
             this.setState({lactatingAnimalCount: -999, lactatingAnimalWidgetMessage: responseJson.message});
          }
          else {
              mainChart.labels = responseJson[0].days;
              mainChart.datasets[0].data = responseJson[0].volumes;
              mainChart.datasets[1].data = responseJson[0].averages;
             this.setState({monthVolumes: responseJson[0].volumes,
              monthDays:responseJson[0].days,
              monthAverages: responseJson[0].averages,
              chartTitle: "Daily Milk Production",
              chartSubTitle: this.state.previsousMonth + " " + prevYear
              });
          }
        })
        .catch(error => this.setState({lactatingAnimalCount: -999,  lactatingAnimalWidgetMessage: error.toString()}));
  }
  loadPreviousPreviousMonthData(){
      let now =  new Date();
      let prevMonth = now.getMonth()+1; // getMonth() returns months in the range of 0-11
      let prevYear = this.state.previsousPreviousMonthYear;
      if (prevMonth === 1 /*Jan*/) {
        prevMonth  = 11;
      } else if (prevMonth === 2 /*Feb*/) {
        prevMonth  = 12;
      } else {
        prevMonth -= 2;
      }

      fetch(API_PREFIX+ '/imd-farm-management/milkinginfo/milkingrecordofmonth', {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "milkingDateStr": prevYear + "-" + prevMonth + "-1" 
            })
          })
       .then(response => response.json())
        .then(responseJson => {
          if (responseJson.error) {
             this.setState({lactatingAnimalCount: -999, lactatingAnimalWidgetMessage: responseJson.message});
          }
          else {
              mainChart.labels = responseJson[0].days;
              mainChart.datasets[0].data = responseJson[0].volumes;
              mainChart.datasets[1].data = responseJson[0].averages;
             this.setState({monthVolumes: responseJson[0].volumes,
              monthDays:responseJson[0].days,
              monthAverages: responseJson[0].averages,
              chartTitle: "Daily Milk Production",
              chartSubTitle: this.state.previousPreviousMonth + " " + prevYear
              });
          }
        })
        .catch(error => this.setState({lactatingAnimalCount: -999,  lactatingAnimalWidgetMessage: error.toString()}));
  }
  loadCurrentYearData(){
      let now =  new Date();
      fetch(API_PREFIX+ '/imd-farm-management/milkinginfo/milkingrecordofeachdayofyear', {
              method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "milkingDateStr": now.getFullYear() 
            })
          })
       .then(response => response.json())
        .then(responseJson => {
          if (responseJson.error) {
             this.setState({lactatingAnimalCount: -999, lactatingAnimalWidgetMessage: responseJson.message});
          }
          else {
            mainChart.labels = responseJson[0].dates;
            mainChart.datasets[0].data = responseJson[0].volumes;
            // mainChart.datasets[1].data = responseJson[0].days;
            mainChartOpts.scales.yAxes = [{ ticks: {
                                                      beginAtZero: true,
                                                      maxTicksLimit: 5,
                                                      stepSize: 25,
                                                      max: 450,
                                                      min: 150,
                                                    },
                                                  }]
             this.setState({monthVolumes: responseJson[0].volumes,monthDays:responseJson[0].dates});
             // alert(responseJson[0].days);
            this.setState({chartTitle: "Daily Milk Production",
            chartSubTitle: new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(new Date())});
          }
        })
        .catch(error => this.setState({lactatingAnimalCount: -999,  lactatingAnimalWidgetMessage: error.toString()}));
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    var {herdSizeTrend, previousPreviousMonth, previsousMonth, currentMonth, currentYear} = this.state;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="8" sm="5" lg="4">
            <Card className="text-white bg-success">
              <CardBody className="pb-0">
                <ButtonGroup className="float-right">
                  <ButtonDropdown id='card1' isOpen={this.state.card1} toggle={() => { this.setState({ card1: !this.state.card1 }); }}>
                    <DropdownToggle caret className="p-0" color="transparent">
                      <i className="icon-location-pin"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem><a href="#/animal/search?searchTypeCD=%">View Active Herd</a></DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </ButtonGroup>
                <div className="text-value" id="herdSize">{this.state.herdSize + " " + this.state.activeAnimalWidgetMessage}</div>
                <div> <Link to={"/animal/search?searchCode=lactatingcows"} style={{color: '#FFF' }} > <i className="fa fa-arrow-circle-right"></i></Link> {this.state.lactatingAnimalWidgetMessage + ': '} {this.state.lactatingAnimalCount} </div>
                <div> <Link to={"/animal/search?searchCode=pregnantcows"} style={{color: '#FFF' }} >  <i className="fa fa-arrow-circle-right"></i></Link> {this.state.pregnantAnimalWidgetMessage  + ': '} {this.state.pregnantCount} </div>
              </CardBody>
              <div className="chart-wrapper" style={{ height: '50px' }}>
                <Line data={herdSizeTrend} options={herdSizeHistoryOpts} height={30} />
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">{this.state.chartTitle}</CardTitle>
                    <div className="small text-muted">{this.state.chartSubTitle}</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(1)} active={this.state.radioSelected === 1}>{previousPreviousMonth}</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(2)} active={this.state.radioSelected === 2}>{previsousMonth}</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(3)} active={this.state.radioSelected === 3}>{currentMonth}</Button>
                        <Button color="outline-secondary" onClick={() => this.onRadioBtnClick(4)} active={this.state.radioSelected === 4}>{currentYear}</Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }} >
                  <Line data={mainChart} options={mainChartOpts}/>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
