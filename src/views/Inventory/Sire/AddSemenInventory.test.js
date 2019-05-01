import React from 'react';
import ReactDOM from 'react-dom';
import AddSire from './AddSemenInventory';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddSemenInventory />, div);
  ReactDOM.unmountComponentAtNode(div);
});
