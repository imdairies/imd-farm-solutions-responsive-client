import React from 'react';
import ReactDOM from 'react-dom';
import UpdateAnimal from './UpdateAnimal';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UpdateAnimal />, div);
  ReactDOM.unmountComponentAtNode(div);
});
