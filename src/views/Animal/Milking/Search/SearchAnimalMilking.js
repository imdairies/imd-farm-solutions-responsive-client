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
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class SearchAnimalMilking extends Component {
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
      authenticated: true,
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
    const parsed = queryString.parse(this.props.location.search);
    this.setState({lookupValueCode: parsed.lookupValueCode});
    this.setState({animaltypelist: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "LCYCL",
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
         this.setState({animaltypelist: [], isLoaded: true, eventAdditionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({animaltypelist: data, isLoaded: true, eventAdditionalMessage: "", messageColor: "success"});         
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
    fetch(API_PREFIX + '/imd-farm-management/animals/search', {
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
         this.setState({items: [], isLoaded: true, eventAdditionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({items: data, isLoaded: true, eventAdditionalMessage: (data.length === 1 ? data.length + " matching record found" : data.length + " matching records found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));
  }


  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { authenticated, isLoaded, items, animaltypelist, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
    if (!authenticated) 
      return (<Redirect to='/login'  />);
    return (
      <div className="animated fadeIn">
         <Row>
         <Col xs="7">
           <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i><strong>Animal Milking Information</strong>
                  </CardHeader>
                  <CardBody>
                    <Nav tabs>
                      <NavItem>
                        <NavLink id="search-tab"
                          className={classnames({ active: true })}
                          onClick={this.handleTabClick("search-tab")}>
                           <i className="fa fa-search"></i><strong>{' '}Search</strong>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink id="add-tab" className={classnames({ active: false })} onClick={this.handleTabClick("add-tab")} >
                          <Link to={'/animal/milking/add'}><i className="fa fa-plus"></i></Link><strong>{' '}Add</strong>
                        </NavLink>
                      </NavItem>
                    </Nav>
                      <Form action="" method="post" onSubmit={this.handleSearch} className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-tag fa-lg mt-1"></i>
                                </InputGroupText>
                              <Input id="animalTag" type="text" maxLength="10" value={this.state.animalTag} onChange={this.handleAnimalTagValue} placeholder="Animal Tag"/>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa icon-menu fa-lg mt-1"></i>
                                </InputGroupText>
                              <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret>
                                  {this.state.animalType}
                                </DropdownToggle>

                                <DropdownMenu onClick={this.handleAnimalTypeSelected}>
                                  <DropdownItem id="ALL" value="ALL" >ALL</DropdownItem>
                                  {animaltypelist.map(animaltypeitem => (
                                  <DropdownItem id={animaltypeitem.lookupValueCode} value={animaltypeitem.lookupValueCode} >{animaltypeitem.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup check className="checkbox" row>
                        <Col>
                          <Input className="form-check-input" type="checkbox" id="activeOnly" name="activeOnly" value="activeOnly"  onClick={this.handleActiveOnly} />
                          <Label check className="form-check-label" htmlFor="checkbox1">Show active only</Label>
                          </Col>
                        </FormGroup>
                        <FormGroup  row>
                          <Col>
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{eventAdditionalMessage}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleSearch}><i className="fa fa-search"></i>{' '}Search</Button>
                    </CardFooter>
                  </Card>
                </Col>
            </Row>
           </Fade>
         </Col>
         </Row>
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
                                <th>Status</th>
                                <th>Dam</th>
                                <th>Sire</th>
                                <th>Updated By</th>
                                <th>Updated Date</th>
                              </tr> 
                           </thead>
                           <tbody>
                             {items.map(item => (
                                 <tr key="{item.animalTag}">
                                   <td>{++recordCount}</td>
                                   <td><Link to={'/animal/milking/view?orgID=IMD&&animalTag=' + item.animalTag}>{item.animalTag}</Link></td>
                                   <td>{item.animalType}</td>
                                   <td>{item.animalStatus}</td>
                                   <td><Link to={'/animal/update?animalTag=' + item.animalDam + '&orgID=' + item.orgID} >{item.animalDam}</Link></td>
                                   <td><a target="_blank" rel="noopener noreferrer" href={(item.isBornThroughAI ? item.animalSireURL : '/animal/update?animalTag=' + item.animalSire + '&orgID=' + item.orgID)} >{item.animalSireAlias + " " + item.animalSire }</a></td>
                                   <td>{item.updatedBy}</td>
                                   <td>{item.updatedDTTM}</td>
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

export default SearchAnimalMilking;
