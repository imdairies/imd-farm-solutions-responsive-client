import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './UpdateAnimalEvent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UpdateAnimalEvent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
