import React, { Component } from 'react';
import { Nav, NavItem, NavLink, Progress, TabContent, TabPane, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { AppSwitch } from '@coreui/react'
import { Link } from 'react-router-dom';


var API_PREFIX = window.location.protocol + '//' + window.location.hostname + ':8080';


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultAside extends Component {

  componentDidMount() {
      this.setState({alertList: [], warningList: [], infoList: []}); 
      fetch(API_PREFIX+ '/imd-farm-management/advisement/retrievealladvisement', {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "animalTag":"%",
            "advisementID":"%",
            "threshold1Violated": true,
            "threshold2Violated": true,
            "threshold3Violated": true
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
           this.setState({alertList: []});
        }
        else {
          // this.setState({alertList: responseJson, warningList: responseJson, infoList: responseJson});
          let th1List = [];
          let th2List = [];
          let th3List = [];
          //alert(responseJson[0].animalTags)    
          for (let i=0; i< responseJson.length; i++) {
            let item = responseJson[i];
            if (item.severityThreshold === "THRESHOLD1") {
              th1List.push(item);
            } else if (item.severityThreshold === "THRESHOLD2") {
              th2List.push(item);
            } else if (item.severityThreshold === "THRESHOLD3") {
              th3List.push(item);
            }
          }

          if (th1List.length === 0 && th2List.length === 0 && th3List.length === 0)
            th1List.push({ruleOutcomeMessage: "Your farm is in tip-top shape - everything seems to be in order", ruleOutcomeShortMessage:"Your farm is in tip-top shape - everything seems to be in order", animalTags:"", advisementRule: "THUMBSUP"});

          this.setState({alertList: th3List, warningList: th2List, infoList: th1List});
        }
      })
      .catch(error => this.setState({eventAdditionalMessage: error.toString(), eventMessageColor: "danger"}));
  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      alertList: [], 
      warningList: [], 
      infoList: []
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    var { alertList, warningList, infoList} = this.state;

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <TabContent activeTab={this.state.activeTab} >
          <TabPane tabId="1">
            <ListGroup className="list-group-accent" tag={'div'}>
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Alerts</ListGroupItem>
                {alertList.map(alertItem => (
                <ListGroupItem action tag="a" href="#" className={(alertItem.advisementRule === "THUMBSUP" ? "list-group-item-accent-success list-group-item-divider" : "list-group-item-accent-danger list-group-item-divider")}>
                    <div className="avatar float-right">
                      <img className="img-avatar" src={"assets/img/avatars/" + alertItem.advisementRule + ".png"} alt="imddairies@gmail.com"/>
                    </div>
                    <div>{alertItem.ruleOutcomeMessage + ": "}<strong>{alertItem.animalTags}</strong></div>
                </ListGroupItem>
                   ))}
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Warnings</ListGroupItem>
                {warningList.map(alertItem => (
                <ListGroupItem action tag="a" href="#" className={(alertItem.advisementRule === "THUMBSUP" ? "list-group-item-accent-success list-group-item-divider" : "list-group-item-accent-warning list-group-item-divider")} >
                    <div className="avatar float-right">
                      <img className="img-avatar" src={"assets/img/avatars/" + alertItem.advisementRule + ".png"} alt="imddairies@gmail.com"/>
                    </div>
                    <div>{alertItem.ruleOutcomeMessage + ": "}<strong>{alertItem.animalTags}</strong></div>
                </ListGroupItem>
                   ))}

              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Intimations</ListGroupItem>
                {infoList.map(alertItem => (
                <ListGroupItem action tag="a" href="#" className={(alertItem.advisementRule === "THUMBSUP" ? "list-group-item-accent-success list-group-item-divider" : "list-group-item-accent-info list-group-item-divider")} >
                    <div className="avatar float-right">
                      <img className="img-avatar" src={"assets/img/avatars/" + alertItem.advisementRule + ".png"} alt="imddairies@gmail.com"/>
                    </div>
                    <div>{alertItem.ruleOutcomeMessage + (alertItem.advisementRule === "THUMBSUP" ? "" : ": ")}<strong>{alertItem.animalTags}</strong></div>
                </ListGroupItem>
                   ))}

            </ListGroup>
          </TabPane>
          <TabPane tabId="2" className="p-3">
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-left mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt...
              </small>
            </div>
            <hr />
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt...
              </small>
            </div>
            <hr />
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt...
              </small>
            </div>
            <hr />
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt...
              </small>
            </div>
            <hr />
            <div className="message">
              <div className="py-3 pb-5 mr-3 float-left">
                <div className="avatar">
                  <img src={'assets/img/avatars/7.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  <span className="avatar-status badge-success"></span>
                </div>
              </div>
              <div>
                <small className="text-muted">Lukasz Holeczek</small>
                <small className="text-muted float-right mt-1">1:52 PM</small>
              </div>
              <div className="text-truncate font-weight-bold">Lorem ipsum dolor sit amet</div>
              <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt...
              </small>
            </div>
          </TabPane>
          <TabPane tabId="3" className="p-3">
            <h6>Settings</h6>

            <div className="aside-options">
              <div className="clearfix mt-4">
                <small><b>Option 1</b></small>
                <AppSwitch className={'float-right'} variant={'pill'} label color={'success'} defaultChecked size={'sm'}/>
              </div>
              <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 2</b></small>
                <AppSwitch className={'float-right'} variant={'pill'} label color={'success'} size={'sm'}/>
              </div>
              <div>
                <small className="text-muted">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 3</b></small>
                <AppSwitch className={'float-right'} variant={'pill'} label color={'success'} defaultChecked size={'sm'} disabled/>
                <div>
                  <small className="text-muted">Option disabled.</small>
                </div>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-3">
                <small><b>Option 4</b></small>
                <AppSwitch className={'float-right'} variant={'pill'} label color={'success'} defaultChecked size={'sm'} />
              </div>
            </div>

            <hr />
            <h6>System Utilization</h6>

            <div className="text-uppercase mb-1 mt-4">
              <small><b>CPU Usage</b></small>
            </div>
            <Progress className="progress-xs" color="info" value="25" />
            <small className="text-muted">348 Processes. 1/4 Cores.</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>Memory Usage</b></small>
            </div>
            <Progress className="progress-xs" color="warning" value="70" />
            <small className="text-muted">11444GB/16384MB</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>SSD 1 Usage</b></small>
            </div>
            <Progress className="progress-xs" color="danger" value="95" />
            <small className="text-muted">243GB/256GB</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>SSD 2 Usage</b></small>
            </div>
            <Progress className="progress-xs" color="success" value="10" />
            <small className="text-muted">25GB/256GB</small>
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default DefaultAside;
