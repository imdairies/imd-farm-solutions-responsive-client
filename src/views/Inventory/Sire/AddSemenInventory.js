import React, { Component } from 'react';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Fade,
  Form,
  FormGroup,
  FormText,
  Input,
  Row,
  Label,
  Nav, 
  NavItem, 
  NavLink,   
  Dropdown, 
  DropdownItem, 
  DropdownMenu, 
  DropdownToggle 
} from 'reactstrap';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';


class AddSemenInventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: new Array(2).fill(false),
      sireList: [],
      animalTag: "",
      animalTagValue: "",
      sexed:"",
      currentSexListPrice : 0.0,
      discountSexPercentage : 0.0 ,
      currentConventionalListPrice : 0.0 ,
      discountConventionalPercentage : 0.0,
      price : 0.0,
      discount: 0.0,
      quantity: 0,
      ordertimestamp: new Date(),
      rcvdtimestamp : new Date(),
      inventorytimestamp : new Date(),

      message: "",
      messageColor: "muted"
    };
    this.handleSireChange = this.handleSireChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.calculateInvoice = this.calculateInvoice.bind(this);
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleInventoryAddedTimestampChanged = this.handleInventoryAddedTimestampChanged.bind(this);
    this.handleRcvdTimestampChanged = this.handleRcvdTimestampChanged.bind(this);

  }

  componentDidMount() {

    fetch('http://localhost:8080/imd-farm-management/animals/retrieveaisire', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": "%"
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
        this.setState({message: responseJson.message, messageColor: "danger"});
      } else {
        this.setState({ sireList: responseJson, message:""});
      }
    })
    .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));

  }

  handleSireChange (event) {
    let arrayIndex = event.target.id;
    //alert(this.state.sireList[arrayIndex].animalTag + " PKR. " + this.state.sireList[arrayIndex].currentSexListPrice);
    this.setState({
      animalTagValue : event.target.value,
      animalTag : this.state.sireList[arrayIndex].animalTag,
      currentSexListPrice : this.state.sireList[arrayIndex].currentSexListPrice,
      discountSexPercentage : this.state.sireList[arrayIndex].discountSexPercentage ,
      currentConventionalListPrice : this.state.sireList[arrayIndex].currentConventionalListPrice ,
      discountConventionalPercentage : this.state.sireList[arrayIndex].discountConventionalPercentage
    });
    if (this.state.sexed === "sexed") {
        this.setState({
          price: this.state.sireList[arrayIndex].currentSexListPrice, 
          discount: this.state.sireList[arrayIndex].discountSexPercentage
        });
        this.calculateInvoice(this.state.sireList[arrayIndex].currentSexListPrice, 
          this.state.sireList[arrayIndex].discountSexPercentage,
          this.state.quantity);
      } else if (this.state.sexed === "conventional") {
        this.setState({
          price: this.state.sireList[arrayIndex].currentConventionalListPrice, 
          discount: this.state.sireList[arrayIndex].discountConventionalPercentage
        });
        this.calculateInvoice(this.state.sireList[arrayIndex].currentConventionalListPrice, 
          this.state.sireList[arrayIndex].discountConventionalPercentage,
          this.state.quantity);        
      } else {
        this.setState({price: 0.0, discount: 0.0});
      }
  }

  handleChange(event) {
    this.setState({message: "", invoice:""});
    if (event.target.id === "sexed") {
      this.setState({sexed:event.target.value});
      if (event.target.value === "sexed") {
        this.setState({price: this.state.currentSexListPrice, discount: this.state.discountSexPercentage})
        this.calculateInvoice(this.state.currentSexListPrice, this.state.discountSexPercentage, this.state.quantity);
      } else {
        this.setState({price: this.state.currentConventionalListPrice, discount: this.state.discountConventionalPercentage})
        this.calculateInvoice(this.state.currentConventionalListPrice, this.state.discountConventionalPercentage, this.state.quantity);
      }
    }
    else if (event.target.id === "price"){
      if (event.target.value < 0) {
        this.setState({message: "Price can't be less than 0 ", messageColor:"danger"});        
      } else {
        this.setState({price: event.target.value});
        this.calculateInvoice(event.target.value, this.state.discount, this.state.quantity);
      }
    }
    else if (event.target.id === "discount") {
      if (event.target.value > 100 || event.target.value < 0) {
        this.setState({message: "Please specify a discount value between 0 and 100", messageColor:"danger"});        
      } else {
        this.setState({discount: event.target.value});
        this.calculateInvoice(this.state.price, event.target.value, this.state.quantity);
      }
    }
    else if (event.target.id === "quantity"){
      if (isNaN(event.target.value) || event.target.value.indexOf(" ") >=0 || event.target.value.indexOf(".") >=0 || event.target.value.indexOf("e") >= 0) {
        this.setState({message: "Quantity must be a whole number", messageColor:"danger"});        
      } else if (event.target.value <= 0) {
        this.setState({message: "Quantity must be greater than 0 ", messageColor:"danger"});        
      } else {
        this.setState({quantity: event.target.value});        
        this.calculateInvoice(this.state.price, this.state.discount, event.target.value);
      }
    }
    else if (event.target.id === "currentConventionalListPrice")
      this.setState({currentConventionalListPrice: event.target.value});
    else if (event.target.id === "discountSexPercentage")
      this.setState({discountSexPercentage: event.target.value});
    else if (event.target.id === "discountConventionalPercentage")
      this.setState({discountConventionalPercentage: event.target.value});
  }

  calculateInvoice(price, discount, quantity) {
    this.setState({invoice: price * ((100-discount)/100) * quantity});
  }

  handleAdd(event) {
    event.preventDefault();

    this.setState({message: ""});

    if (this.state.animalTag === "") {
      this.setState({messageColor: "danger", message: "Please select a Sire"});      
    } else if (this.state.sexed === "") {
      this.setState({messageColor: "danger", message: "Please specify whether it is sexed semen or conventional"});      
    } else if (this.state.price === "") {
      this.setState({messageColor: "danger", message: "Please enter a price"});      
    } else if (this.state.discount === "") {
      this.setState({messageColor: "danger", message: "Please enter a discount"});      
    } else if (!(this.state.quantity > 0)) {
      this.setState({messageColor: "danger", message: "Please specify a valid quantity"});      
    } else {
      fetch('http://localhost:8080/imd-farm-management/inventory/addsemen', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "itemSKU": this.state.animalTag,
            "itemType": (this.state.sexed === "sexed" ? "Y" : "N"),
            "quantity": this.state.quantity,
            "price": this.state.price,
            "discount": this.state.discount,
            "invoiceAmount": this.state.invoice,
            "receivedDttmStr": this.state.rcvdtimestamp.getFullYear() + "-" + (this.state.rcvdtimestamp.getMonth()+1) + "-" + this.state.rcvdtimestamp.getDate() + " " + this.state.rcvdtimestamp.getHours() + ":" + this.state.rcvdtimestamp.getMinutes(),
            "inventoryAddDttmStr": this.state.inventorytimestamp.getFullYear() + "-" + (this.state.inventorytimestamp.getMonth()+1) + "-" + this.state.inventorytimestamp.getDate() + " " + this.state.inventorytimestamp.getHours() + ":" + this.state.inventorytimestamp.getMinutes(),
            "orderDttmStr": this.state.ordertimestamp.getFullYear() + "-" + (this.state.ordertimestamp.getMonth()+1) + "-" + this.state.ordertimestamp.getDate() + " " + this.state.ordertimestamp.getHours() + ":" + this.state.ordertimestamp.getMinutes()
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({message: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({message: responseJson.message, messageColor: "success"});         
        }
      })
      .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));

    }
  }

  handleTimestampChanged (newValue) {
    this.setState({ordertimestamp: newValue});
  }

  handleInventoryAddedTimestampChanged (newValue) {
    this.setState({inventorytimestamp: newValue});
  }

  handleRcvdTimestampChanged (newValue) {
    this.setState({rcvdtimestamp: newValue});
  }


  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }


  render() {
    var { message, messageColor, sireList} = this.state;
    let sireCount = 0;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="10">
            <Fade timeout={this.state.timeout} in={this.state.fadeIn}>
              <Row>
                <Col md="9">
                 <Nav tabs>
                    <NavItem>
                      <NavLink id="Sire-List"
                        className={classnames({ active: false })}
                      >
                         <Link to={'/inventory/sire/search/searchsemenInventory'}><i className="fa fa-list"></i>{' '}</Link><strong>Semen Inv</strong>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink id="add-tab"
                        className={classnames({ active: true })}
                      >
                         <i className="fa fa-plus"></i><strong>{' '}Add Semen Inv</strong>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <Card>
                    <CardBody>
                      <Form action="" method="post" className="form-horizontal">
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Sire Code</Label>
                          <Col sm="4">
                            <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                              this.toggle(0);}}>
                              <DropdownToggle caret>
                                {this.state.animalTagValue}
                              </DropdownToggle>
                              <DropdownMenu onClick={this.handleSireChange}>
                                {sireList.map(sire => (sire.semenInd === 'Y' ? <DropdownItem id={sireCount++} value={sire.animalTag + '-' + sire.alias}>{sire.animalTag + '-' + sire.alias}</DropdownItem> : ''))}
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Semen Type</Label>
                          <Col sm="4">
                            <Dropdown isOpen={this.state.dropdownOpen[1]} toggle={() => {
                              this.toggle(1);}}>
                              <DropdownToggle caret>
                                {this.state.sexed}
                              </DropdownToggle>
                              <DropdownMenu onClick={this.handleChange}>
                                <DropdownItem id="sexed" value="sexed">sexed</DropdownItem>
                                <DropdownItem id="sexed" value="conventional">conventional</DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Order Timestamp</Label>
                          <Col sm="8">
                            <DateTimePicker onChange={this.handleTimestampChanged} value={this.state.ordertimestamp} required showLeadingZeros />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Order Rcvd Timestamp</Label>
                          <Col sm="8">
                            <DateTimePicker onChange={this.handleRcvdTimestampChanged} value={this.state.rcvdtimestamp} required showLeadingZeros />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Added Timestamp</Label>
                          <Col sm="8">
                            <DateTimePicker onChange={this.handleInventoryAddedTimestampChanged} value={this.state.inventorytimestamp} required showLeadingZeros />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Quantity</Label>
                          <Col sm="2">
                          <Input id="quantity" type="text" value={this.state.quantity} onChange={this.handleChange} />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Price</Label>
                          <Col sm="3">
                          <Input id="price" type="number"  min="0"  value={this.state.price} onChange={this.handleChange}/>
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Discount %</Label>
                          <Col sm="3">
                          <Input id="discount" type="number" min="0" max="100" value={this.state.discount} onChange={this.handleChange} />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label sm="4" htmlFor="input-normal">Total Invoice (PKR)</Label>
                          <Col sm="2">{this.state.invoice}
                          </Col>
                        </FormGroup>
                        <FormText color={messageColor}>&nbsp;{message}</FormText>
                      </Form>
                    </CardBody>
                    <CardFooter>
                      <Button type="button" size="md" color="primary" onClick={this.handleAdd}><i className="fa fa-plus"></i>{' '}Add</Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </Fade>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AddSemenInventory;
