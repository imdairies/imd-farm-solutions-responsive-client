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
   Input,
   Row,  
   Label,
   Table,
   Dropdown, 
   DropdownItem, 
   DropdownMenu, 
  DropdownToggle 
} from 'reactstrap';

import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import queryString from 'query-string';
var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';



class SearchFeedPlan extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: new Array(100).fill(false),
      collapse: true,
      warning: false,
      fadeIn: true,
      timeout: 300,
      items: [],
      isLoaded: true,
      animalTag: "",
      cohortTypeDisplayValue: "-- Select Feed Cohort --",
      activeOnly: false,
      messageColor: "muted",
      cohortTypelist: [],
      authenticated: true,
      feedItems: [],
      dirty: false,
      copiedPlan: [],
      hideAddRowButton: true,
      quantityMethods: []
    };

    this.handleCohortTypeSelected = this.handleCohortTypeSelected.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleQuantityMethodChange = this.handleQuantityMethodChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
    this.handleFulfillmentPctChanged = this.handleFulfillmentPctChanged.bind(this);
    this.handleMinValueChanged = this.handleMinValueChanged.bind(this);
    this.handleMaxValueChanged = this.handleMaxValueChanged.bind(this);
    this.handleFeedItemChanged = this.handleFeedItemChanged.bind(this);
    this.handleUnitValueChanged = this.handleUnitValueChanged.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleCopyPlan = this.handleCopyPlan.bind(this);
    this.handlePastePlan = this.handlePastePlan.bind(this);
  }

  handleCopyPlan(event) {
    this.setState({copiedPlan: this.state.items})
  }
  handlePastePlan(event) {
    let newItems = this.state.items;
    newItems = newItems.concat(this.state.copiedPlan);
    this.setState({items: newItems, dirty:true});
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
         this.setState({cohortTypelist: data, isLoaded: true, additionalMessage: ""});         
      }
    })
    .catch(error => this.setState({additionalMessage: error.toString(), messageColor: "danger"}));


    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "QTYMETHOD",
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
         this.setState({quantityMethods: [], isLoaded: true, additionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({quantityMethods: data, isLoaded: true, additionalMessage: ""});         
      }
    })
    .catch(error => this.setState({additionalMessage: error.toString(), messageColor: "danger"}));

    fetch(API_PREFIX + '/imd-farm-management/lookupvalues/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "categoryCode": "FEED",
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
         this.setState({feedItems: [], isLoaded: true, additionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({feedItems: data, isLoaded: true, additionalMessage: ""});         
      }
    })
    .catch(error => this.setState({additionalMessage: error.toString(), messageColor: "danger"}));


    const parsed = queryString.parse(this.props.location.search);
    if (parsed.feedCohort) {
      this.setState({cohortTypeDisplayValue: parsed.feedCohort});
      this.handleSearch(parsed.feedCohort);      
    }

   }

  handleFulfillmentPctChanged(event) {
    let items = this.state.items;
  //  alert((event.target.id-1) +  ': [' + items[event.target.id-1].fulfillmentPct + ']' + '[' + event.target.value + ']');
    items[event.target.id-1].fulfillmentPct = event.target.value;
    this.setState({items:items, dirty: true});
  }
  handleUnitValueChanged(event) {
    let items = this.state.items;
    // alert(event.target.id + ' [' + items[event.target.id-1].units + '][' +  event.target.value + ']');
    items[event.target.id-1].units = event.target.value;
    this.setState({items:items, dirty: true});
  }

  handleMinValueChanged(event) {
    let items = this.state.items;
    // alert((event.target.id-1) +  ': [' + items[event.target.id-1].minimumFulfillment + ']' + '[' + event.target.value + ']');
    items[event.target.id-1].minimumFulfillment = event.target.value;
    this.setState({items:items, dirty: true});
  }

  handleMaxValueChanged(event) {
    let items = this.state.items;
    // alert((event.target.id-1) +  ': [' + items[event.target.id-1].maximumFulfillment + ']' + '[' + event.target.value + ']');
    items[event.target.id-1].maximumFulfillment = event.target.value;
    this.setState({items:items, dirty: true});
  }

  handleUpdate(event) {
    let feedPlanItems = [];
    // alert(this.state.items.length);

    for (let i=0; i< this.state.items.length; i++) {
      let item = this.state.items[i];
      // alert("[" + item.lookupValueCode + "][" + item.fulfillmentPct +"]");
      if (item.units === "")
        alert("Please enter units");
      else
        feedPlanItems.push({feedItemCD:item.lookupValueCode,
          minimumFulfillment:item.minimumFulfillment === '' ? null : item.minimumFulfillment, 
          fulfillmentPct:item.fulfillmentPct, 
          maximumFulfillment:item.maximumFulfillment === '' ? null : item.maximumFulfillment, 
          fulFillmentTypeCD:item.fulFillmentTypeCD, 
          units:item.units});
    }
    // alert(feedPlanItems.length);

    fetch(API_PREFIX + '/imd-farm-management/feed/updatefeedplan', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "feedCohortCD": this.state.cohortType,
          "loginToken": (new Cookies()).get('authToken'),
          feedPlanItems
      })
    })
    .then(response => {
      if (response.status === 401)
        this.setState({authenticated : false});
      return response.json();
    })
    .then(data => {
      if (data.error) {
         this.setState({isLoaded: true, additionalMessage: data.message, messageColor: "danger"});
      }
      else {
         this.setState({isLoaded: true, additionalMessage: data.message, messageColor: "success"});
      }
    })
    .catch(error => this.setState({additionalMessage: "Exception >> " + error.toString(), messageColor: "danger"}));
  }


   handleRemoveRow(event) {
    let index = event.target.id-1;
    let itemsMinusOneRow = this.state.items; //[];
    if (index >= 0) {
      // alert("removing item " + index);
      // for (let i = 0; i < this.state.items.length; i++) {
      //   if (i !== index) {
      //     alert("adding " + this.state.items[i].lookupValueCode);
      //     itemsMinusOneRow.push(this.state.items[i]);
      //   }
      //   else
      //     alert("Removing " + this.state.items[i].lookupValueCode);
      // }
      itemsMinusOneRow.splice(index,1);
    //  itemsMinusOneRow = itemsMinusOneRow.splice(1,1);
    // ({shortDescription: "",fulfillmentPct:"", minimumFulfillment: "", maximumFulfillment: "", fulFillmentTypeCD: "", units:""});
      this.setState({items: itemsMinusOneRow, dirty: true});
    } 
   }

   handleAddRow(event) {
    let itemsPlusOneRow = this.state.items;
    itemsPlusOneRow.push({shortDescription: "",fulfillmentPct:"", minimumFulfillment: "", maximumFulfillment: "", fulFillmentTypeCD: "", units:""});
    this.setState({items: itemsPlusOneRow, dirty: true});
  }

  handleQuantityMethodChange(event) {
    // alert(event.target.id);
    event.preventDefault();
    let items = this.state.items;
    // alert((event.target.id-1) +  ': [' + items[event.target.id-1].fulFillmentTypeCD + ']' + '[' + event.target.value + ']');
    items[event.target.id-1].fulFillmentTypeCD = event.target.value;
    this.setState({items:items, dirty: true});
  }

  handleFeedItemChanged(event) {
    event.preventDefault();
    // alert(event.target.id);
    let items = this.state.items;
    // alert((event.target.id-1) +  ': [' + items[event.target.id-1].lookupValueCode + ']' + '[' + event.target.value + ']');
    items[event.target.id-1].lookupValueCode = event.target.value;
    this.setState({items:items, dirty: true});
  }

  handleCohortTypeSelected(event) {
    event.preventDefault();
    this.setState({cohortType: event.target.id, cohortTypeDisplayValue:event.target.value, hideAddRowButton: false});
    this.handleSearch(event.target.id);
  }
  handleTabClick(targetID) {
   //alert(targetID + " was clicked");
  }

  handleSearch(cohortType) {
    //event.preventDefault();
    this.setState({dirty: false, items: [], isLoaded: false}); 
    fetch(API_PREFIX + '/imd-farm-management/feed/retrievefeedplan', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify(jsonString)

        body: JSON.stringify({
          "animalType": (cohortType === "-- Feed Cohort --" || cohortType === "ALL" ? null : cohortType),
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
         this.setState({items: data, isLoaded: true, additionalMessage: (data.length === 1 ? data.length + " feed item row found" : data.length + " feed item rows found"), messageColor: "success"});         
      }
    })
    .catch(error => this.setState({additionalMessage: error.toString(), messageColor: "danger"}));



  }


  render() {
    var { authenticated, dirty, isLoaded, feedItems, items, cohortTypelist, quantityMethods, additionalMessage, messageColor } = this.state;
    let recordCount = 1;
    let keyIndex = 0;
    if (!authenticated)
      return (<Redirect to='/login'  />);
    return (
      <div className="animated fadeIn">
         <Row>
         <Col xs="7">
           <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
            <Row>
              <Col md="10">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i><strong>Feed Plan</strong>
                  </CardHeader>
                  <CardBody>
                      <Form action="#" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Col>&nbsp;
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="3" htmlFor="input-normal">Feed Cohort</Label>
                          <Col>
                            <InputGroup>
                              <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                                this.toggle(0);
                              }}>
                                <DropdownToggle caret> 
                                  {this.state.cohortTypeDisplayValue}
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
                                  <DropdownItem key={keyIndex++} id={cohortTypeitem.lookupValueCode} value={cohortTypeitem.shortDescription} >{cohortTypeitem.shortDescription}</DropdownItem>
                               ))}
                                  </DropdownMenu>
                                </Dropdown>
                            </InputGroup>
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{additionalMessage}</FormText>
                      </Form>
                    </CardBody>
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
                   <i className="fa fa-align-justify"></i> Feed Plan {(isLoaded ? "": " Loading ...")}
                     <div className="card-header-actions">
                       <Button color="link" className="card-header-action btn-minimize" data-target="#animaldata" ></Button>
                     </div>
                   </CardHeader>
                     <CardBody>
                       <Table hover bordered striped responsive size="lg">
                         <thead>
                            <tr align="middle">
                              <th>#</th>
                              <th>Item</th>
                              <th>Qty</th>
                              <th>Min</th>
                              <th>Max</th>
                              <th>Type</th>
                              <th>Units</th>
                              <th>                                    
                                <Button type="button" size="sm" color="danger"><i className="fa fa-remove"></i></Button>
                              </th>
                            </tr>
                         </thead>
                         <tbody>
                           {items.map(item => (
                              <tr align="middle">
                                <td>{recordCount++}</td>
                                <td width="20%">
                                  <select id={recordCount-1}  onChange={this.handleFeedItemChanged}>
                                        <option key='-1' id='-1' value="" > </option>
                                        {feedItems.map(feedItem => (
                                        <option key={keyIndex++} id={recordCount-1} selected={item.lookupValueCode === feedItem.lookupValueCode ? true : false} value={feedItem.lookupValueCode} >{feedItem.shortDescription + ' (' + feedItem.lookupValueCode +')'}</option>
                                     ))}
                                  </select>
                                </td>

                                <td width="10%">
                                  <Input id={recordCount-1} maxLength="3" type="number" name={'fulfillmentPct' + (recordCount-1)} value={item.fulfillmentPct} onChange={this.handleFulfillmentPctChanged} placeholder="quantity" />
                                </td>
                                <td width="10%">
                                  <Input id={recordCount-1} maxLength="3" type="number" name={'minimumFulfillment' + (recordCount-1)} value={item.minimumFulfillment} onChange={this.handleMinValueChanged} placeholder="min" />
                                </td>
                                <td width="10%">
                                  <Input id={recordCount-1} maxLength="3" type="number" name={'maximumFulfillment' + (recordCount-1)} value={item.maximumFulfillment} onChange={this.handleMaxValueChanged} placeholder="max" />
                                </td>
                                <td width="20%">
                                  <select id={recordCount-1} onChange={this.handleQuantityMethodChange}>
                                      <option key='-2' id='-2' value="" > </option>
                                      {quantityMethods.map(qtyItem => (
                                      <option key={keyIndex++} selected={item.fulFillmentTypeCD === qtyItem.lookupValueCode ? true : false} value={qtyItem.lookupValueCode} >{qtyItem.shortDescription + ' (' + qtyItem.lookupValueCode + ')'}</option>
                                   ))}
                                  </select>
                                </td>
                                <td width="10%">
                                  <Input id={recordCount-1} type="text" name={'units' + (recordCount-1)} value={item.units} onChange={this.handleUnitValueChanged} placeholder="units" />
                                </td>
                                <td width="5%" align="middle">
                                    <Input id={(recordCount-1)} type="button" size="sm" color="danger" onClick={this.handleRemoveRow} value="delete"/>                                    
                                </td>
                              </tr>
                             ))}
                          <tr>
                            <td colspan="8" align="right">
                               <Button type="button" size="md" color="warning" disabled={this.state.hideAddRowButton} onClick={this.handleAddRow}><i className="fa fa-plus"></i>{' '}</Button> &nbsp;&nbsp;
                             </td>
                           </tr>
                         </tbody>
                       </Table>
                        <Row>
                          <Col>
                            <Button type="button" size="md" color="success" onClick={this.handleCopyPlan}><i className="fa fa-copy"></i>{' '}</Button>&nbsp;&nbsp;
                            <Button type="button" size="md" color="success" disabled={this.state.copiedPlan.length === 0} onClick={this.handlePastePlan}><i className="fa fa-paste"></i>{' '}</Button>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <FormText color={messageColor}>&nbsp;{additionalMessage}</FormText>
                          </Col>
                        </Row>
                     </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" disabled={!dirty}  onClick={this.handleUpdate}><i className="fa fa-pencil"></i>{' '}Update</Button>
                    </CardFooter>
                </Card>
             </Fade>
          </Col>
         </Row>
      </div>
    );
  }
}

export default SearchFeedPlan;
