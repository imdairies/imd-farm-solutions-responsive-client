import React from 'react';
import ReactDOM from 'react-dom';
import Forms from './FeedList';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<FeedList />, div);
  ReactDOM.unmountComponentAtNode(div);
});
