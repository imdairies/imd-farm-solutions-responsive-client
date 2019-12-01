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
   InputGroup,
   InputGroupText,
   Row,
   Table,
   Nav, 
   NavItem, 
   NavLink, 
   Dropdown, 
   DropdownItem, 
   DropdownMenu, 
  DropdownToggle 
} from 'reactstrap';

import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class SearchFeedPlan extends Component {
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
      cohortType: "-- Feed Cohort --",
      activeOnly: false,
      messageColor: "muted",
      cohortTypelist: [],
      additionalMessage: "Select Cohort Type",
      authenticated: true
    };

    this.handleCohortTypeSelected = this.handleCohortTypeSelected.bind(this);
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

  componentDidMount() {
//    const parsed = queryString.parse(this.props.location.search);
    this.setState({cohortTypelist: [], isLoaded: false}); 
    // alert(parsed.searchTypeCD);
    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "FEEDCOHORT",
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
         this.setState({cohortTypelist: [], isLoaded: true, additionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({cohortTypelist: data, isLoaded: true, additionalMessage: "", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({additionalMessage: error.toString(), messageColor: "danger"}));
   }


  handleCohortTypeSelected(event) {
    this.setState({cohortType: event.target.value});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleSearch(event) {
    event.preventDefault();
    this.setState({items: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/feed/retrievefeedplan', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalType": (this.state.cohortType === "-- Feed Cohort --" || this.state.cohortType === "ALL" ? null : this.state.cohortType),
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
         this.setState({items: [], isLoaded: true, additionalMessage: data.message, messageColor: "danger"});
      } else {
         this.setState({items: data, isLoaded: true, additionalMessage: (data.length === 1 ? data.length + " matching record found" : data.length + " matching records found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({additionalMessage: error.toString(), messageColor: "danger"}));
  }


  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { authenticated, isLoaded, items, cohortTypelist, additionalMessage, messageColor } = this.state;
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
                    <i className="fa fa-align-justify"></i><strong>Feed Plan</strong>
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
                        <NavLink id="add-tab"
                          className={classnames({ active: false })}
                          onClick={this.handleTabClick("add-tab")}
                        >
                           <Link to={'/animal/add'}><i className="fa fa-plus"></i>{' '}</Link><strong>Add</strong>
                        </NavLink>
                      </NavItem>
                    </Nav>
                      <Form action="#" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
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
                                  {this.state.cohortType}
                                </DropdownToggle>

                                <DropdownMenu onClick={this.handleCohortTypeSelected}
                                modifiers={{
                                  setMaxHeight: {
                                    enabled: true,
                                    order: 890,
                                    fn: (data) => {
                                      return {
                                        ...data,
                                        styles: {
                                          ...data.styles,
                                          overflow: 'auto',
                                          maxHeight: 400,
                                        },
                                      };
                                    },
                                  },
                                }}>
                                  {cohortTypelist.map(cohortTypeitem => (
                                  <DropdownItem id={cohortTypeitem.lookupValueCode} value={cohortTypeitem.lookupValueCode} >{cohortTypeitem.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{additionalMessage}</FormText>
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
                              <th>Item</th>
                              <th>Start ⟺ End</th>
                              <th>Min ⟺ Max</th>
                              <th>Qty</th>
                              <th>Type</th>
                              <th>Units</th>
                            </tr>
                         </thead>
                         <tbody>
                           {items.map(item => (
                               <tr key="{recordCount}">
                                 <td>{++recordCount}</td>
                                 <td>{item.shortDescription}</td>
                                 <td>{item.start + "⟺" + item.end}</td>
                                 <td>{item.minimumFulfillment + "⟺" + item.maximumFulfillment}</td>
                                 <td>{item.fulfillmentPct}</td>
                                 <td>{item.fulFillmentTypeCD}</td>
                                 <td>{item.units}</td>
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

export default SearchFeedPlan;
