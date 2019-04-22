import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './SearchAnimalEvent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchAnimalEvent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
