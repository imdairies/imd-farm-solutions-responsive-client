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
      messageColor: "muted",
      animaltypelist: [],
      eventAdditionalMessage: "Enter search fields (you can use % for wild card searches) and press Search button"
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
    fetch('http://localhost:8080/imd-farm-management/animals/retrieveaisire', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": this.state.animalTag,
          "animalType": "%"
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
    fetch('http://localhost:8080/imd-farm-management/animals/retrieveaisire', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": this.state.animalTag,
          "animalType": "%"
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


  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { isLoaded, items, animaltypelist, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
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
                              <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Code</th>
                                <th>Use Count</th>
                                <th>Controller</th>
                                <th>Data Sheet</th>
                                <th>photo</th>
                              </tr> 
                           </thead>
                           <tbody>
                             {items.map(item => (
                                 <tr key="{item.animalTag}">
                                   <td>{++recordCount}</td>
                                   <td>{item.alias}</td>
                                   <td>{item.animalTag}</td>
                                   <th>xxx</th>
                                   <td>{item.controller}</td>
                                   <td width="25%"><a target="_blank" rel="noopener noreferrer" href={item.sireDataSheet}>View Data Sheet</a></td>
                                   <td><a target="_blank" rel="noopener noreferrer" href={item.sirePhoto} ><img src={item.sirePhoto} width="100" height="60" /></a></td>
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

export default SearchSire;
