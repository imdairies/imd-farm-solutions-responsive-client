import React from 'react';
import ReactDOM from 'react-dom';
import IMDAddLifecycleEventCode from './IMDAddLifecycleEventCode';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IMDAddLifecycleEventCode />, div);
  ReactDOM.unmountComponentAtNode(div);
});
