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
   InputGroupAddon,
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



class Forms extends Component {
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
      eventcode : "" ,
      shortdescription: "",
      longdescription: "",
      messageColor: "muted",
      eventAdditionalMessage: "Enter search fields (you can use % for wild card searches) and press Search button"
    };
    this.handleChange = this.handleChange.bind(this); 
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({eventcode: parsed.eventCode});
   }

  handleChange(event) {
    if (event.target.id === "eventcode")
      this.setState({eventcode: event.target.value});
    if (event.target.id === "shortdescription")
      this.setState({shortdescription: event.target.value});
    if (event.target.id === "longdescription")
      this.setState({longdescription: event.target.value});
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleSearch(event) {
    event.preventDefault();
    this.setState({items: [], isLoaded: false}); 
    // var jsonString = '{"eventCode":"' + (this.state.eventcode) + '", "eventShortDescription":"' + (this.state.shortdescription) + '", "eventLongDescription":"' + (this.state.longdescription) + '"}';
    // alert(jsonString);
    fetch('http://localhost:8080/imd-farm-management/lv-lifecycle-event/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "eventCode": this.state.eventcode,
          "eventShortDescription": this.state.shortdescription,
          "eventLongDescription": this.state.longdescription
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
                 <Nav tabs>
                    <NavItem>
                      <NavLink id="search-tab"
                        className={classnames({ active: true })}
                        onClick={this.handleTabClick("search-tab")}
                      >
                         <i className="fa fa-search"></i><strong>{' '}Search</strong>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="add-tab"
                        className={classnames({ active: false })}
                        onClick={this.handleTabClick("add-tab")}
                      >
                         <Link to={'/base/IMDAddLifecycleEventCode'}><i className="fa fa-plus"></i>{' '}</Link><strong>Add</strong>
                      </NavLink>
                    </NavItem>
                  </Nav>

                  <Card>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Col >
                            <InputGroup>
                                <InputGroupText>
                                  <i className="fa fa-heartbeat fa-lg mt-1"></i>
                                </InputGroupText>
                              <Input id="eventcode" type="text" maxLength="10" value={this.state.eventcode} onChange={this.handleChange} placeholder="Event Code"/>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Col >
                            <InputGroup className="mb-1">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="fa fa-align-left fa-lg mt-1"></i>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input id="shortdescription" type="text" maxLength="75" value={this.state.shortdescription} onChange={this.handleChange} placeholder="Event Description" />
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
                                <th>Event Code</th>
                                <th>Short Description</th>
                                <th>Long Description</th>
                                <th>Status</th>
                                <th>Updated By</th>
                                <th>Updated Date</th>
                              </tr>
                           </thead>
                           <tbody>
                             {items.map(item => (
                                 <tr key="{item.eventCode}">
                                   <td>{++recordCount}</td>
                                   <td><Link to={'/base/IMDEditLifecycleEventCode?eventCode=' + item.eventCode} >{item.eventCode}</Link></td>
                                   <td>{item.eventShortDescription}</td>
                                   <td>{item.eventLongDescription}</td>
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

export default Forms;
