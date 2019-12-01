import React from 'react';
import ReactDOM from 'react-dom';
import UpdateLookup from './UpdateMessage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UpdateMessage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
