import React from 'react';
import ReactDOM from 'react-dom';
import IMDEditLifecycleEventCode from './IMDEditLifecycleEventCode';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IMDEditLifecycleEventCode />, div);
  ReactDOM.unmountComponentAtNode(div);
});
