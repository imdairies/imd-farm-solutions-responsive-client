import React from 'react';
import ReactDOM from 'react-dom';
import AddLookup from './AddLookup';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddLookup />, div);
  ReactDOM.unmountComponentAtNode(div);
});
