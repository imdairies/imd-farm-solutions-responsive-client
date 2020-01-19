import React, { Component } from 'react';

import {
  FormText,
  Card,
  CardBody,
  CardHeader,
  Col,
  Fade,
  Row,
  Table
} from 'reactstrap';

import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class ViewSireRecord extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      dropdownOpen: new Array(1).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      timeout: 300,
      eventlist: [],
      eventSearchFilterlist: [],
      eventCode: "ALL",
      eventCodeID: "%",
      isLoaded: true,
      authenticated: true,
      animalTag: "",
      messageColor: "muted",
      animaltaglist: [],
      message: "... loading",
      testDate: new Date()
    };
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  componentDidMount() {

    const parsed = queryString.parse(this.props.location.search);
    let sire = parsed.sire;
    let outcome = parsed.outcome;
    let alias = parsed.alias;
    if (sire || outcome) {
      // alert("Exists");
      this.setState({alias: alias, sire:sire});

      fetch(API_PREFIX + '/imd-farm-management/animalevent/viewsirerecord', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          // body: JSON.stringify(jsonString)

          body: JSON.stringify({
            "animalTag": "%",
            "auxField1Value": sire,
            "auxField3Value": outcome,
            "loginToken": (new Cookies()).get('authToken')
      })
    })
    .then(response => {
      if (response.status === 401)
        this.setState({authenticated : false});
      return response.json();
    })
    .then(data => {
      if (data.error) {
           this.setState({eventlist: [], isLoaded: true, message: data.message, messageColor: "danger"});
        }
        else {
           this.setState({eventlist: data, isLoaded: true, message: (data.length === 1 ? data.length + " life time event found" : data.length + " life time events found"), messageColor: "success"});
        }
      })
      .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
    }
    else {
      this.setState({eventlist: [], isLoaded: true, message: "Illegal access", messageColor: "danger"});
      // return;
    }

   }


  handleAnimalTagChanged(event) {
    this.setState({animalTag: event.target.value});
  }
  handleEventSelected(event) {
    this.setState({eventCode: event.target.value, eventCodeID: event.target.id});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }


  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { isLoaded, authenticated, eventlist, messageColor, message } = this.state;
    let recordCount = 0;
    if (!authenticated)
      return (<Redirect to='/login'  />);
    return (
      <div className="animated fadeIn">

         <Row>
            <Col xs="10" lg="12">
               <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                  <Card>
                     <CardHeader>
                     <i className="fa fa-align-justify"></i> Insemination Record of {this.state.alias} - {this.state.sire} {(isLoaded ? "": " (Loading ...)")}
                     </CardHeader>
                       <CardBody>
                         <Table hover bordered striped responsive size="sm">
                           <thead>
                              <tr>
                                <th>#</th>
                                <th>Dam</th>
                                <th>Timestamp</th>
                                <th>Type</th>
                                <th>Inseminated By</th>
                                <th>Day(s) Ago</th>
                                <th>Sexed ?</th>
                                <th>Successful</th>
                                <th>Comments</th>
                              </tr> 
                           </thead>
                           <tbody>
                             {eventlist.map(item => (
                                <tr key="{item.animalTag}">
                                  <td>{eventlist.length - ++recordCount + 1}</td>
                                  <td><Link to={'/animal/update?animalTag=' + item.animalTag + '&orgID=' + item.orgID} >{item.animalTag}</Link></td>
                                  <td width="10%" data-toggle="tooltip" title={item.eventTimeStamp.substring(item.eventTimeStamp.length-8).trim()}>{item.eventTimeStamp.substring(0,item.eventTimeStamp.length-8).trim()}</td>
                                  <td><Link to={'/animal/event/update?eventTransactionID=' + item.eventTransactionID} >{item.eventShortDescription}</Link></td>
                                  <td>{item.eventOperator}</td>
                                  <td>{item.daysFromToday}</td>
                                  <td>{item.auxField2Value === 'YES' ? '🚺': '🚻'}</td>
                                  <td>{item.auxField3Value === 'YES' ? '✅' : item.auxField3Value === 'NO' ? '❌' : item.auxField3Value === 'TBD' ? '⏳' : item.auxField3Value }</td>
                                  <td width="50%">{item.eventComments}</td>
                                </tr>
                               ))}
                           </tbody>
                         </Table>
                        <FormText color={messageColor}>&nbsp;{message}</FormText>
                       </CardBody>
                  </Card>
               </Fade>
            </Col>
         </Row>
      </div>
    );
  }
}

export default ViewSireRecord;
