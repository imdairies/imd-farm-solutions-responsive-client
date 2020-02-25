import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './PhotoGallery';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PhotoGallery />, div);
  ReactDOM.unmountComponentAtNode(div);
});
