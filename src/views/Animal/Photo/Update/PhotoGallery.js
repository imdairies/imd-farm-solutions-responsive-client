import React, { Component} from 'react';

import {
  Button, Card, CardBody, CardFooter, CardHeader, Col,FormGroup, FormText, Input, Row,Label,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import DateTimePicker from 'react-datetime-picker';


import Cookies from 'universal-cookie';

const moment = require('moment-timezone'); //moment-timezone

var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';

class PhotoGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidAccess: false,
      authenticated: true,
      comments: "",
      timestamp: new Date(moment.tz("Asia/Aqtau").year(),
        moment.tz("Asia/Aqtau").month(),moment.tz("Asia/Aqtau").date(),
        moment.tz("Asia/Aqtau").hour(),
        moment.tz("Asia/Aqtau").minute()),
      fileName: "",
      photoList: [],
      file: null,
    };
    this.handleUpload = this.handleUpload.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleTimestampChanged = this.handleTimestampChanged.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);
    this.loadAnimalPhotos = this.loadAnimalPhotos.bind(this);
    this.handlePhotoSelected = this.handlePhotoSelected.bind(this);
  }
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.setState({items: [], animalTag: parsed.animalTag, lifecycleStageList: [], orgID: parsed.orgID, invalidAccess: (parsed.animalTag ? false : true)});
    this.setState({isLoaded: false, genericMessage: "Processing..."}); 

   // alert(API_PREFIX);
    this.loadAnimalPhotos(parsed.animalTag);
  }

handlePhotoSelected(event) {
  // event.preventDefault();
  // alert(event.target);
  // alert("value=" + event.target.value);
  // alert("name=" + event.target.name);
  // alert("id=" + event.target.id);
}

loadAnimalPhotos(animalTag) {
 fetch(API_PREFIX + '/imd-farm-management/fileupload/retrieveanimalphotos', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "animalTag": animalTag,
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
         this.setState({photoList: [], isLoaded: true, message: data.message, messageColor: "danger"});
      }
      else {
         this.setState({photoList: data, isLoaded: true, message: data.length + " photos found for the animal", messageColor: "success"});         
      }
    })
    .catch(error => this.setState({eventAdditionalMessage: error.toString(), messageColor: "danger"}));    
}

handleFileSelected(event) {
  event.preventDefault();
  // alert(event.target.files[0].name);
  this.setState({file: event.target.files[0], fileName: event.target.value});
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
      let formattedTimestamp = this.state.timestamp.getFullYear() + "-" + 
        (this.state.timestamp.getMonth() +1 ) + "-" + 
        this.state.timestamp.getDate() + " " + 
        this.state.timestamp.getHours() + ":" + 
        this.state.timestamp.getMinutes();
      let formData = new FormData(); 
      formData.append('file',this.state.file);
      formData.append('animalTag',this.state.animalTag);
      formData.append("loginToken", (new Cookies()).get('authToken'));
      formData.append("comments", this.state.comments);
      formData.append("photoTimestamp", formattedTimestamp);




      // formData.append('file','Hello World');
      // formData.append('animalTag','60');


      fetch(API_PREFIX + '/imd-farm-management/fileupload/uploadphoto', {
        method: 'POST',
        // headers: {
            // 'Accept': 'multipart/form-data',
            // 'Content-Type': 'multipart/form-data',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Credentials': 'true',
            // 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST, PUT',
            // 'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        // },
        body: formData
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({isLoaded: true, message: responseJson.message, messageColor: "danger"});
        }
        else {
           this.setState({isLoaded: true, message: responseJson.message, messageColor: "success"});
           this.loadAnimalPhotos(this.state.animalTag);
        }
      })
      .catch(error => this.setState({message: error.toString(), messageColor: "danger"}));
    }
  }

  render() {
    var { message, invalidAccess, messageColor, authenticated, photoList} = this.state;

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
               {photoList.map(item => (
                  <a id={'ha' + item.photoID} name={item.photoID} onClick={this.handlePhotoSelected} href={'/assets/img/cow-photos/' + item.animalTag + '/' + item.photoID}  target="_blank" rel="noopener noreferrer" title={item.comments + ' (Age : ' + item.ageAtPhotoTimeStamp +')'}><img src={'/assets/img/cow-photos/' + item.animalTag + '/' + item.photoID}  width="90" alt={item.photoID} />&nbsp;</a>
                 ))}
              </CardBody>
              <CardFooter>
                <FormText color={messageColor}><p>{message}</p></FormText>
              </CardFooter>
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
                    <Input type="file" name="fileName" accept="image/*" value={this.state.fileName} onChange={this.handleFileSelected} />
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
