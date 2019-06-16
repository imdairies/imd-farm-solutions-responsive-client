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
      items: [],
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
         this.setState({items: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({items: responseJson, isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? responseJson.length + " matching record found" : responseJson.length + " matching records found"), messageColor: "success"});         
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
    var { isLoaded, items, animaltypelist, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
    return (
      <div className="animated fadeIn">
         
         <Row>
          <Col xs="10" lg="12">
             <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                <Card>
                   <CardHeader>
                   <i className="fa fa-align-justify"></i> Animal Feed Information {(isLoaded ? "": " Loading ...")}
                     <div className="card-header-actions">
                       <Button color="link" className="card-header-action btn-minimize" data-target="#animaldata" ></Button>
                     </div>
                   </CardHeader>
                     <CardBody>
                       <Table hover bordered striped responsive size="lg">
                         <thead>
                            <tr>
                              <th>#</th>
                              <th>Tag#</th>
                              <th>Age</th>
                              <th>Cohort</th>
                              <th>Cohort Condition</th>
                              <th>Comments</th>
                            </tr> 
                         </thead>
                         <tbody>
                           {items.map(item => (
                               <tr key="{item.animalTag}">
                                 <td>{++recordCount}</td>
                                 <td><Link to={'/animal/update?animalTag=' + item.animalTag + '&orgID=' + item.orgID} >{item.animalTag}</Link></td>
                                 <td>{item.currentAge}</td>
                                 <td>{item.feedCohortTypeCD}</td>
                                 <td>{item.feedCohortDeterminatationCriteria}</td>
                                 <td>{item.animalFeedCohortDeterminatationMessage}</td>
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
