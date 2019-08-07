import React from 'react';
import ReactDOM from 'react-dom';
import AddSire from './AddFeedPlan';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddFeedPlan />, div);
  ReactDOM.unmountComponentAtNode(div);
});
