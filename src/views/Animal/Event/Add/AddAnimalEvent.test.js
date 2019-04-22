import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './AddAnimalEvent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddAnimalEvent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
