import React from 'react';
import ReactDOM from 'react-dom';
import UpdateAnimal from './ViewMilking';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ViewMilking />, div);
  ReactDOM.unmountComponentAtNode(div);
});
