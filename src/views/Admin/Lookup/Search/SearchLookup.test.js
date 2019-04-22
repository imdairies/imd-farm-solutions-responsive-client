import React from 'react';
import ReactDOM from 'react-dom';
import Forms from './SearchLookup';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchLookup />, div);
  ReactDOM.unmountComponentAtNode(div);
});
