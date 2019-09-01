import React, { Component } from 'react';

import {
   Badge,
   Button,
   Card,
   CardBody,
   CardFooter,
   CardHeader,
   Col,
   Collapse,
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
   NavLink
} from 'reactstrap';

import { Link } from 'react-router-dom';
import queryString from 'query-string';
import classnames from 'classnames';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class SearchLookup extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      warning: false,
      fadeIn: true,
      timeout: 300,
      items: [],
      isLoaded: true,
      categoryCode: "",
      lookupValueCode : "" ,
      messageColor: "muted",
      eventAdditionalMessage: "Enter search fields (you can use % for wild card searches) and press Search button"
    };
    this.handleChange = this.handleChange.bind(this); 
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({lookupValueCode: parsed.lookupValueCode});
   }

  handleChange(event) {
    if (event.target.id === "categoryCode")
      this.setState({categoryCode: event.target.value});
    if (event.target.id === "lookupValueCode")
      this.setState({lookupValueCode: event.target.value});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleSearch(event) {
    event.preventDefault();
    this.setState({items: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "categoryCode": this.state.categoryCode,
          "lookupValueCode": this.state.lookupValueCode
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

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {
    var { isLoaded, items, eventAdditionalMessage, messageColor } = this.state;
    let recordCount = 0;
    return (
      <div className="animated fadeIn">
         <Row>
         <Col xs="7">
           <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i><strong>Lookup Maintenance</strong>
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
                           <Link to={'/admin/lookup/add'}><i className="fa fa-plus"></i>{' '}</Link><strong>Add</strong>
                        </NavLink>
                      </NavItem>
                    </Nav>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa fa-list fa-lg mt-1"></i>
                                </InputGroupText>
                              <Input id="categoryCode" type="text" maxLength="10" value={this.state.categoryCode} onChange={this.handleChange} placeholder="Category Code"/>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col>
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa fa-file-code-o fa-lg mt-1"></i>
                                </InputGroupText>
                              <Input id="lookupValueCode" type="text" maxLength="10" value={this.state.lookupValueCode} onChange={this.handleChange} placeholder="Lookup Code"/>
                            </InputGroup>
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
                     <i className="fa fa-align-justify"></i> Lifecycle Events {(isLoaded ? "": " Loading ...")}
                       <div className="card-header-actions">
                         <Button color="link" className="card-header-action btn-minimize" data-target="#eventdata" onClick={this.toggle}><i className="icon-arrow-up"></i></Button>
                       </div>
                     </CardHeader>
                     <Collapse isOpen={this.state.collapse} id="eventdata">
                       <CardBody>
                         <Table hover bordered striped responsive size="lg">
                           <thead>
                              <tr>
                                <th>#</th>
                                <th>Category</th>
                                <th>Code</th>
                                <th>Short Description</th>
                                <th>Long Description</th>
                                <th>Field 1</th>
                                <th>Status</th>
                                <th>Updated By</th>
                                <th>Updated Date</th>
                              </tr>
                           </thead>
                           <tbody>
                             {items.map(item => (
                                 <tr key="{item.lookupValueCode + item.categoryCode}">
                                   <td>{++recordCount}</td>
                                   <td><Link to={'/admin/lookup/update?categoryCode=' + item.categoryCode + '&lookupValueCode=' + item.lookupValueCode} >{item.categoryCode}</Link></td>
                                   <td><Link to={'/admin/lookup/update?categoryCode=' + item.categoryCode + '&lookupValueCode=' + item.lookupValueCode} >{item.lookupValueCode}</Link></td>
                                   <td>{item.shortDescription}</td>
                                   <td>{item.longDescription}</td>
                                   <td>{item.additionalField1}</td>
                                   <td><Badge color={(item.isActive ? "success" : "secondary")}>{(item.isActive ? "active" : "inactive")}</Badge></td>
                                   <td>{item.updatedBy}</td>
                                   <td>{item.updatedDTTM}</td>
                               </tr>
                               ))}
                           </tbody>
                         </Table>
                       </CardBody>
                     </Collapse> 
                  </Card>
               </Fade>
            </Col>
         </Row>
      </div>
    );
  }
}

export default SearchLookup;
