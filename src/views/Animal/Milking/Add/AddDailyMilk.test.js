import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './AddDailyMilk';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddDailyMilk />, div);
  ReactDOM.unmountComponentAtNode(div);
});
