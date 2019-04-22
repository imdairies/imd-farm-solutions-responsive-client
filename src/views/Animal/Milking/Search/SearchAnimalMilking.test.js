import React from 'react';
import ReactDOM from 'react-dom';
import Forms from './SearchAnimalMilking';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchAnimalMilking />, div);
  ReactDOM.unmountComponentAtNode(div);
});
