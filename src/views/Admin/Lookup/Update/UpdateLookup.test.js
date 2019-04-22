import React from 'react';
import ReactDOM from 'react-dom';
import UpdateLookup from './UpdateLookup';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UpdateLookup />, div);
  ReactDOM.unmountComponentAtNode(div);
});
