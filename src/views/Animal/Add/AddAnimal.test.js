import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './AddAnimal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddAnimal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
