import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './AddFarmEvent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddFarmEvent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
