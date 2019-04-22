import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './AddFarmDailyMilk';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddFarmDailyMilk />, div);
  ReactDOM.unmountComponentAtNode(div);
});
