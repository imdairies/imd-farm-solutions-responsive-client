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
// import queryString from 'query-string';
import classnames from 'classnames';



class ViewInseminationInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warning: false,
      fadeIn: true,
      timeout: 300,
      items: [],
      isLoaded: true,
      activeOnly: false,
      messageColor: "muted",
      eventAdditionalMessage: "Enter search fields (you can use % for wild card searches) and press Search button"
    };
  }

  componentDidMount() {
    this.setState({items: [], isLoaded: false}); 
    fetch('http://localhost:8080/imd-farm-management/animals/adultfemalecows', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": "%",
          "animalType": "%",
          "activeOnly": true
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


  render() {
    var { isLoaded, items, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
    var date = new Date();
    return (
      <div className="animated fadeIn">
         <Row>
            <Col xs="10" lg="12">
               <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                  <Card>
                     <CardHeader>
                     <i className="fa fa-align-justify"></i> Animals {(isLoaded ? "": " Loading ...")}
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
                                <th>Type</th>
                                <th>Calvings</th>
                                <th>Inseminated At</th>
                                <th>Insemination Summary</th>
                                <th>Days Since Insemination</th>
                                <th>Insemination Attempts</th>
                              </tr> 
                           </thead>
                           <tbody>
                             {items.map(item => (
                                <tr key="{item.animalTag}">
                                  <td>{++recordCount}</td>
                                  <td><Link to={'/animal/update?animalTag=' + item.animalTag + '&orgID=' + item.orgID} >{item.animalTag}</Link></td>
                                  <td>{item.animalType}</td>
                                  <td>{item.parturationCount}</td>
                                  <td>{item.lastInseminationTimeStamp}</td>
                                  <td>{(item.isPregnant === "YES" ? "✅" : (item.isPregnant === "UNKNOWN" ? "❓" : "")) + (item.sexed === "YES" ? "🚺":"")} <a target="_blank" rel="noopener noreferrer" href={'#/animal/event/update?eventTransactionID=' + item.eventTransactionID + '&orgID=' + item.orgID} >{item.sireInformation}</a> </td>
                                  <td>{item.daysSinceInsemination}</td>
                                  <td>{item.inseminationAttempts}</td>
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

export default ViewInseminationInfo;
