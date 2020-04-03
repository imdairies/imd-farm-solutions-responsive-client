import React, { Component } from 'react';

import {
   Button,
   Card,
   CardBody,
   CardHeader,
   Col,
   Fade,
   Row,
   Table,
} from 'reactstrap';

import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';


class FeedList extends Component {
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
      animalFeedInfo: [],
      feedItems: [],
      isLoaded: true,
      animalTag: "",
      animalType: "-- Animal Type --",
      activeOnly: false,
      messageColor: "muted",
      animaltypelist: [],
      authenticated: true,
      eventAdditionalMessage: "Processing..."
    };
    this.handleAnimalTagValueChanged = this.handleAnimalTagValueChanged.bind(this);
    this.handleActiveOnly = this.handleActiveOnly.bind(this);
    this.handleAnimalTypeSelected = this.handleAnimalTypeSelected.bind(this);
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

  handleActiveOnly() {
    this.setState({activeOnly: !this.state.activeOnly});
  }

  componentDidMount() {
    this.setState({items: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/feed/farmactiveanimalfeedlisting', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": this.state.animalTag,
          "animalType": (this.state.animalType === "-- Animal Type --" || this.state.animalType === "ALL" ? null : this.state.animalType),
          "activeOnly": this.state.activeOnly,
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
         this.setState({animalFeedInfo: [], feedItems:[], isLoaded: true, eventAdditionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({animalFeedInfo: data.animalFeedInfo, feedItems: data.feedItems.feedPlanItems, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
   }

  handleAnimalTagValueChanged(event) {
    this.setState({animalTag: event.target.value});
  }

  handleAnimalTypeSelected(event) {
    this.setState({animalType: event.target.value});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }


  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { authenticated, feedItems, animalFeedInfo, eventAdditionalMessage } = this.state;
    let recordCount = 0;
    if (!authenticated) 
      return (<Redirect to='/login'  />);

    return (
      <div className="animated fadeIn">
         
         <Row>
          <Col >
             <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                <Card>
                   <CardHeader>
                   <i className="fa fa-align-justify"></i> Animal Feed Information {eventAdditionalMessage}
                     <div className="card-header-actions">
                       <Button color="link" className="card-header-action btn-minimize" data-target="#animaldata" ></Button>
                     </div>
                   </CardHeader>
                     <CardBody>
                       <Table hover bordered striped responsive size="sm">
                         <thead>
                            <tr  align="center" valign="middle">
                              <th rowspan="2">#</th>
                              <th rowspan="2">Tag#</th>
                              <th rowspan="2">Age</th>
                              <th rowspan="2">Cohort</th>
                              <th rowspan="2">Weight (kg)</th>
                              <th rowspan="2">Milk Avg (lpd)</th>
                              <th colspan="2">DM (Kg)</th>
                              <th colspan="2">CP (Kg)</th> 
                              <th colspan="2">ME (MJ)</th>
                               {feedItems.map(item => (
                                <th rowspan="2">{item.shortDescription} <br/>{item.dailyIntake + ' ' + item.units}</th>
                                  ))}
                            </tr> 
                            <tr  align="center" valign="middle">
                              <th title = "Target Dry Matter"><span role="img" aria-label="target">🎯</span></th>
                              <th title = "Achieved Dry Matter"><span role="img" aria-label="achieved">🔍</span></th>
                              <th title = "Target Crude Protein"><span role="img" aria-label="target">🎯</span></th>
                              <th title = "Achieved Crude Protein"><span role="img" aria-label="achieved">🔍</span></th>
                              <th title = "Target Metabolizable Energy"><span role="img" aria-label="target">🎯</span></th>
                              <th title = "Achieved Metabolizable Energy"><span role="img" aria-label="achieved">🔍</span></th>
                            </tr> 
                         </thead>
                         <tbody>
                           {animalFeedInfo.map(item => (
                               <tr key="{item.animalTag}" align="center">
                                 <td width="2%">{++recordCount}</td>
                                 <td width="5%" title = {item.animalFeedCohortDeterminatationMessage} ><Link to={'/animal/update?animalTag=' + item.animalTag + '&orgID=' + item.orgID} >{item.animalTag}</Link></td>
                                 <td width="22%">{item.currentAge}</td>
                                 <td width="10%" title = {item.feedCohortDeterminatationCriteria}>{item.feedCohortTypeShortDescr}</td>
                                 <td> {item.weight === "" ? "?" : item.weight}</td>
                                 <td> {item.milkingAverage === "" ? "-" : item.milkingAverage}</td>
                                 <td>{item.nutritionalNeedsDryMatter}</td>
                                 <td bgcolor={item.planAchievedDM < item.nutritionalNeedsDryMatter ? "#F4DCDB" : "#DDF5DF"}>{item.planAchievedDM}</td>
                                 <td>{item.nutritionalNeedsCrudeProtein}</td>
                                 <td bgcolor={item.planAchievedCP < item.nutritionalNeedsCrudeProtein ? "#F4DCDB" : "#DDF5DF"}>{item.planAchievedCP}</td>
                                 <td>{item.nutritionalNeedsMetabloizableEnergy}</td>
                                 <td bgcolor={item.planAchievedME < item.nutritionalNeedsMetabloizableEnergy ? "#F4DCDB" : "#DDF5DF"}>{item.planAchievedME}</td>
                                 {item.feedPlanItems.map(foodItem => (
                                  <td title={'Rs' + foodItem.costOfIntake}>{foodItem.dailyIntake}</td>
                                    ))}
                             </tr>
                             ))}
                         </tbody>
                       </Table>
                     </CardBody>
                </Card>
             </Fade>
          </Col>
         </Row>
      </div>
    );
  }
}

export default FeedList;
