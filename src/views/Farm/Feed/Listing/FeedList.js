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
   InputGroup,
   InputGroupText,
   Row,
   Table,
   Nav, 
   NavItem, 
   NavLink, 
   Label,
   Dropdown, 
   DropdownItem, 
   DropdownMenu, 
  DropdownToggle 
} from 'reactstrap';

import { Link } from 'react-router-dom';
import queryString from 'query-string';
import classnames from 'classnames';



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
      eventAdditionalMessage: "Enter search fields (you can use % for wild card searches) and press Search button"
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
    fetch('http://localhost:8080/imd-farm-management/feed/farmactiveanimalfeedlisting', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": this.state.animalTag,
          "animalType": (this.state.animalType === "-- Animal Type --" || this.state.animalType === "ALL" ? null : this.state.animalType),
          "activeOnly": this.state.activeOnly
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({animalFeedInfo: [], feedItems:[], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
      // alert(responseJson.feedItems.feedPlanItems[0].shortDescription);
         this.setState({animalFeedInfo: responseJson.animalFeedInfo, feedItems: responseJson.feedItems.feedPlanItems, isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? responseJson.length + " matching record found" : responseJson.length + " matching records found"), messageColor: "success"});         
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
    var { feedItems, isLoaded, animalFeedInfo, animaltypelist, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
    return (
      <div className="animated fadeIn">
         
         <Row>
          <Col >
             <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                <Card>
                   <CardHeader>
                   <i className="fa fa-align-justify"></i> Animal Feed Information {(isLoaded ? "": " Loading ...")}
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
                              <th colspan="3">Target Needs</th>
                               {feedItems.map(item => (
                                <th rowspan="2">{item.shortDescription} <br/>{item.dailyIntake + ' ' + item.units}</th>
                                  ))}
                            </tr> 
                            <tr  align="center" valign="middle">
                              <th>DM (Kg)</th>
                              <th>CP (Kg)</th>
                              <th>ME (xx)</th>
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
                                 <td>{item.nutritionalNeedsDryMatter}</td>
                                 <td>{item.nutritionalNeedsCrudeProtein}</td>
                                 <td>{item.nutritionalNeedsMetabloizableEnergy}</td>
                                 {item.feedPlanItems.map(foodItem => (
                                  <td>{foodItem.dailyIntake}</td>
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
