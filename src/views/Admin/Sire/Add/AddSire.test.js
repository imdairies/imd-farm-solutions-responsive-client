import React from 'react';
import ReactDOM from 'react-dom';
import AddSire from './AddSire';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddSire />, div);
  ReactDOM.unmountComponentAtNode(div);
});
