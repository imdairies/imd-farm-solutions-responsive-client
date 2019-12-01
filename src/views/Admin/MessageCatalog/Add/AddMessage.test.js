import React from 'react';
import ReactDOM from 'react-dom';
import AddLookup from './AddMessage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddMessage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
