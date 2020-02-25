import React, { Component} from 'react';

import {
  Button, Card, CardBody, CardFooter, CardHeader, Col,FormGroup, FormText, Input, Row,Label,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import DateTimePicker from 'react-datetime-picker';

import Cookies from 'universal-cookie';


var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';

class PhotoGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidAccess: false,
      authenticated: true,
      comments: "",
      timestamp: new Date(),
      fileName:"",
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);
  }
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({items: [], animalTag: parsed.animalTag, lifecycleStageList: [], orgID: parsed.orgID, invalidAccess: (parsed.animalTag ? false : true)});
    this.setState({isLoaded: false, genericMessage: "Processing..."}); 

   // alert(API_PREFIX);
    fetch(API_PREFIX + '/imd-farm-management/animals/search', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "orgID": parsed.orgID,
          "animalTag": parsed.animalTag,
          "loginToken": (new Cookies()).get('authToken'),
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.error) {
         this.setState({items: [], isLoaded: true, genericMessage: responseJson.message, messageColor: "danger"});
      }
      else {
         this.setState({items: responseJson});
          if (responseJson.length > 1)
            this.setState({messageColor: "danger"});
      }
    })
    .catch(error => this.setState({genericMessage: error.toString(), messageColor: "danger"}));
  }
handleFileSelected(event) {
  event.preventDefault();
  this.setState({fileName: event.target.value});
}
handleCommentsChange(event) {
  event.preventDefault();
  this.setState({comments: event.target.value});
}
  handleTimestampChanged(newValue) {
    this.setState({timestamp: newValue});
  }

  handleUpload(event) {
    event.preventDefault();
    if (this.state.fileName === "") {
      this.setState({messageColor:"danger", message:"Please select an animal photo"});
    } else if (this.state.timestamp === "") {
      this.setState({messageColor:"danger", message:"Please enter the timestamp for the selected photo"});
    } else if (this.state.comments === "") {
      this.setState({messageColor:"danger", message:"Please enter comments"});
    } else {
      fetch(API_PREFIX+ '/imd-farm-management/animals/uploadphoto', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag": this.state.animalTag,
            "photoId": "",
            "loginToken": (new Cookies()).get('authToken'),
        })
      })
      .then(response => {
        if (response.status === 401)
          this.setState({authenticated : false});
        return response.json();
      })
      .then(data => {
        if (data.error) {
           this.setState({imageList: [], isLoaded: true, message: data.message, messageColor: "danger"});
        }
        else {
           this.setState({imageList: data, isLoaded: true, message: "", messageColor: "success"});         
        }
      })
      .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));  
    }
  }

  render() {
    var { message, invalidAccess, messageColor, authenticated} = this.state;

    if (invalidAccess)
      return (<Redirect to='/animal/search'  />);
    if (!authenticated)
      return (<Redirect to='/login'  />);



    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="8" xl="6">
            <Card>
              <CardHeader>
              </CardHeader>
              <CardBody>
                 <a href={this.state.frontSideImageURL} target="_blank" rel="noopener noreferrer" ><img src={this.state.frontSideImageURLThumb}  width="20%" alt={'front'} /></a>&nbsp;&nbsp;
                 <a href={this.state.backSideImageURL} target="_blank" rel="noopener noreferrer" ><img src={this.state.backSideImageURLThumb}  width="20%" alt={'back'} /></a>&nbsp;&nbsp;
                 <a href={this.state.rightSideImageURL} target="_blank" rel="noopener noreferrer" ><img src={this.state.rightSideImageURLThumb}  width="20%" alt={'right'} /></a>&nbsp;&nbsp;
                 <a href={this.state.leftSideImageURL} target="_blank" rel="noopener noreferrer" ><img src={this.state.leftSideImageURLThumb}  width="20%" alt={'left'} /></a>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="6" align="center">
            <Card>
              <CardBody>
                <FormGroup row >
                  <Label sm="3" htmlFor="input-normal">Animal Photo</Label>
                  <Col sm="6">
                    <Input type="file" name="fileName"  value={this.state.fileName} onChange={this.handleFileSelected} />
                  </Col>
                </FormGroup>
                <FormGroup row >
                  <Label sm="3" htmlFor="input-normal">Photo Date</Label>
                  <Col sm="4">
                    <DateTimePicker id="photoTimeStamp" onChange={this.handleTimestampChanged} value={this.state.timestamp} required showLeadingZeros />
                  </Col>
                </FormGroup>
                <FormGroup row >
                  <Label sm="3" htmlFor="input-normal">Comments</Label>
                  <Col sm="6">
                    <Input id="comments" type="textarea" value={this.state.comments} onChange={this.handleCommentsChange} placeholder="Photo Comments"  />
                  </Col>
                </FormGroup>
              </CardBody>
              <CardFooter>
                <FormText color={messageColor}><p>{message}</p></FormText>
                <Button type="button" size="md" color="primary" onClick={this.handleUpload}><i className="fa fa-upload"></i>&nbsp;Upload</Button>
              </CardFooter>
              </Card>
          </Col>
    </Row>
  </div>
    );
  }
}

export default PhotoGallery;
