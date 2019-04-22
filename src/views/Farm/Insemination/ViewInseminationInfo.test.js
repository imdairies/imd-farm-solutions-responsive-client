import React from 'react';
import ReactDOM from 'react-dom';
import UpdateAnimal from './ViewInseminationInfo';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ViewInseminationInfo />, div);
  ReactDOM.unmountComponentAtNode(div);
});
