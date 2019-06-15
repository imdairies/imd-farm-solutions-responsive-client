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
      allItems: [],
      inStockItems: [],
      isLoaded: true,
      animalTag: "",
      instockOnly: false,
      messageColor: "muted",
      animaltypelist: [],
      eventAdditionalMessage: "Enter search fields (you can use % for wild card searches) and press Search button"
    };
    this.handleAnimalTagValue = this.handleAnimalTagValue.bind(this);
    this.handleInstockOnly = this.handleInstockOnly.bind(this);
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

  handleInstockOnly() {
    // alert(this.state.instockOnly);
    this.setState({instockOnly: !this.state.instockOnly});
    let index;
    if (this.state.instockOnly)
      this.setState({items: this.state.allItems});
    else
      this.setState({items: this.state.inStockItems});
  }

  componentDidMount() {
    this.setState({items: [], inStockItems: [], allItems: [], isLoaded: false});
    let inStockItems = [];
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
         this.setState({items: [], allItems: [], inStockItems: [], isLoaded: true, eventAdditionalMessage: responseJson.message, messageColor: "danger"});
      } else {
        this.setState({items: responseJson, allItems: responseJson, isLoaded: true, eventAdditionalMessage: (responseJson.length === 1 ? responseJson.length + " matching record found" : responseJson.length + " matching records found"), messageColor: "success"});
        for (let index = 0; index < responseJson.length; index++) {
          if (responseJson[index].conventionalStock > 0 || responseJson[index].sexedStock > 0)
            inStockItems.push(responseJson[index]);
        }
        this.setState({inStockItems: inStockItems});
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
    var { isLoaded, items, inStockItems, allItems, animaltypelist, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
    return (
      <div className="animated fadeIn">
         <Row>
            <Col xs="6" md="10">
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
                          <CardHeader>
                          <FormGroup check className="checkbox" row>
                          <Col>
                            <Input className="form-check-input" type="checkbox" id="instockOnly" name="instockOnly" value="instockOnly"  onClick={this.handleInstockOnly} />
                            <Label check className="form-check-label" htmlFor="checkbox1">Show in-stock only</Label>
                          </Col>
                          </FormGroup>
                          </CardHeader>
                          <CardBody>
                           <Table hover bordered striped responsive size="sm">
                             <thead>
                              <tr  align="center" valign="middle">
                                <th rowspan="2">#</th>
                                <th rowspan="2">Name</th>
                                <th rowspan="2">Code</th>
                                <th rowspan="2">Controller</th>
                                <th colspan="2">Stock</th>
                                <th colspan="4" align="right" >Semen Usage</th>
                                <th rowspan="2">Data Sheet</th>
                                <th rowspan="2">photo</th>
                              </tr> 
                              <tr>
                                <th>🚻</th>
                                <th>🚺</th>
                                <th>✌️</th>
                                <th>✅</th>
                                <th>❌</th>
                                <th>⏳</th>
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
                                     <td>{isNaN(Math.round((item.semenSuccessCount / item.semenUsageCount) * 100)) ? "-" : Math.round((item.semenSuccessCount / item.semenUsageCount) * 100) + "%"}</td>
                                     <td>{item.semenSuccessCount}</td>
                                     <td>{item.semenFailureCount}</td>
                                     <td>{item.semenTbdCount}</td>
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
