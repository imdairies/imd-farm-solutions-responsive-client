import React, { Component } from 'react';

import {
  Card,
  CardBody,
  Col,
  FormText,
  Fade,
  Row,
  Table,
  Nav, 
  NavItem, 
  NavLink,
} from 'reactstrap';

import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class SearchSire extends Component {
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
      activeOnly: false,
      authenticated: true,
      messageColor: "muted",
      animaltypelist: [],
      message: "... loading"
    };
    this.handleAnimalTagValue = this.handleAnimalTagValue.bind(this);
    this.handleActiveOnly = this.handleActiveOnly.bind(this);
    this.handleAnimalTypeSelected = this.handleAnimalTypeSelected.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
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
    fetch(API_PREFIX + '/imd-farm-management/animals/retrieveaisire', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": this.state.animalTag,
          "animalType": "%",
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
         this.setState({items: [], isLoaded: true, message: data.message, messageColor: "danger"});
      }
      else {
         this.setState({items: data, isLoaded: true, message: (data.length === 1 ? data.length + " matching record found" : data.length + " matching records found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
   }

  handleAnimalTagValue(event) {
    this.setState({animalTag: event.target.value});
  }

  handleAnimalTypeSelected(event) {
    this.setState({animalType: event.target.value});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleSearch(event) {
    event.preventDefault();
    this.setState({items: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/animals/retrieveaisire', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": this.state.animalTag,
          "animalType": "%",
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
         this.setState({items: [], isLoaded: true, message: data.message, messageColor: "danger"});
      }
      else {
         this.setState({items: data, isLoaded: true, message: (data.length === 1 ? data.length + " matching record found" : data.length + " matching records found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
  }


  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { authenticated, items, messageColor, message } = this.state;
    let recordCount = 0;
    if (!authenticated)
      return (<Redirect to='/login'  />);
    return (
      <div className="animated fadeIn">
         <Row>
            <Col xs="6" md="8">
               <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
                  <Card>
                       <CardBody>
                        <Nav tabs>
                          <NavItem>
                            <NavLink id="search-tab"
                              className={classnames({ active: true })}
                              onClick={this.handleTabClick("search-tab")}>
                               <i className="fa fa-align-justify"></i><strong>{' '}Sire List</strong>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink id="add-tab" className={classnames({ active: false })} onClick={this.handleTabClick("add-tab")} >
                              <Link to={'/admin/sire/add'}><i className="fa fa-plus"></i></Link><strong>{' '}Add</strong>
                            </NavLink>
                          </NavItem>
                        </Nav>
                         <Table hover bordered striped responsive size="lg">
                           <thead>
                              <tr  align="center" valign="middle">
                                <th rowspan="2">#</th>
                                <th rowspan="2">Name</th>
                                <th rowspan="2">Code</th>
                                <th colspan="4" align="right" >Semen Usage</th>
                                <th rowspan="2">Controller</th>
                                <th rowspan="2">Data Sheet</th>
                                <th rowspan="2">photo</th>
                              </tr> 
                              <tr>
                                <th><span role="img" aria-label="%Success">✌️</span></th>
                                <th><span role="img" aria-label="success">✅</span></th>
                                <th><span role="img" aria-label="failure">❌</span></th>
                                <th><span role="img" aria-label="tbd">⏳</span></th>
                              </tr> 
                           </thead>
                           <tbody>
                             {items.map(item => (
                                 <tr key="{item.animalTag}">
                                   <td width="5%">{++recordCount}</td>
                                   <td width="5%"><a  rel="noopener noreferrer" href={'#/admin/sire/viewrecord?alias=' + item.alias +'&sire=' + item.animalTag}>{item.alias}</a></td>
                                   <td width="5%">{item.animalTag}</td>
                                   <td width="10%">{isNaN(Math.round((item.semenSuccessCount / item.semenUsageCount) * 100)) ? "-" : Math.round((item.semenSuccessCount / item.semenUsageCount) * 100) + "%"}</td>
                                   <td width="5%"><a  rel="noopener noreferrer" href={'#/admin/sire/viewrecord?alias=' + item.alias +'&sire=' + item.animalTag + '&outcome=YES'}>{item.semenSuccessCount}</a></td>
                                   <td width="5%"><a  rel="noopener noreferrer" href={'#/admin/sire/viewrecord?alias=' + item.alias +'&sire=' + item.animalTag + '&outcome=NO'}>{item.semenFailureCount}</a></td>
                                   <td width="5%"><a  rel="noopener noreferrer" href={'#/admin/sire/viewrecord?alias=' + item.alias +'&sire=' + item.animalTag + '&outcome=TBD'}>{item.semenTbdCount}</a></td>
                                   <td>{item.controller}</td>
                                   <td width="40%"><a target="_blank" rel="noopener noreferrer" href={item.sireDataSheet}>Data Sheet</a></td>
                                   <td width="20%"><a target="_blank" rel="noopener noreferrer" href={item.sirePhoto} ><img alt='Sire' src={item.sirePhoto} width="100" height="60" /></a></td>
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

export default SearchSire;
