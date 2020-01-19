import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './ViewSireRecord';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ViewSireRecord />, div);
  ReactDOM.unmountComponentAtNode(div);
});
