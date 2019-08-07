import React from 'react';
import ReactDOM from 'react-dom';
import Forms from './SearchFeedPlan';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchFeedPlan />, div);
  ReactDOM.unmountComponentAtNode(div);
});
