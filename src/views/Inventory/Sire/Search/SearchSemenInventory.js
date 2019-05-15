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



class SearchSemenInventory extends Component {
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
    fetch('http://localhost:8080/imd-farm-management/inventory/retrievallsiresinventory', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalTag": "%",
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
                               <i className="fa fa-align-justify"></i><strong>{' '}Semen Inv</strong>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink id="add-tab" className={classnames({ active: false })} onClick={this.handleTabClick("add-tab")} >
                              <Link to={'/inventory/sire/addsemeninventory'}><i className="fa fa-plus"></i></Link><strong>{' '}Add Semen Inv</strong>
                            </NavLink>
                          </NavItem>
                        </Nav>
                        <Card>
                          <CardHeader><strong>In Stock</strong></CardHeader>
                          <CardBody>
                            <Table hover bordered responsive size="sm">
                              <thead>
                                <tr>
                                  <th width="10">Total:</th>
                                  <th width="10">nn</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td width="10">Conventional:</td>
                                  <td width="10">nn</td>
                                </tr>
                                <tr>
                                  <td width="10">Sexed:</td>
                                  <td width="10">nn</td>
                                </tr>
                              </tbody>
                            </Table>
                          </CardBody>
                        </Card>
                        <Card>
                          <CardHeader><strong>Stock Detail</strong></CardHeader>
                          <CardBody>
                           <Table hover bordered striped responsive size="sm">
                             <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Name</th>
                                  <th>Code</th>
                                  <th>Controller</th>
                                  <th>Stock Conv</th>
                                  <th>Stock Sexed</th>
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
                                     <td>{item.controller}</td>
                                     <td><font color={item.conventionalStock > 0 ? "blue" : ""}>{item.conventionalStock > 0 ? item.conventionalStock: "-"}</font></td>
                                     <td><font color={item.sexedStock > 0 ? "blue" : ""}>{item.sexedStock > 0 ? item.sexedStock: "-"}</font></td>
                                     <td width="25%"><a target="_blank" rel="noopener noreferrer" href={item.sireDataSheet}>View Data Sheet</a></td>
                                     <td><a target="_blank" rel="noopener noreferrer" href={item.sirePhoto} ><img src={item.sirePhoto} width="100" height="60" /></a></td>
                                 </tr>
                                 ))}
                             </tbody>
                           </Table>
                         </CardBody>
                        </Card>
                       </CardBody>
                  </Card>
               </Fade>
            </Col>
         </Row>
      </div>
    );
  }
}

export default SearchSemenInventory;
