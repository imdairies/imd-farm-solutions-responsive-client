import React from 'react';
import ReactDOM from 'react-dom';
import AddAnimal from './UploadMilkRecord';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UploadMilkRecord />, div);
  ReactDOM.unmountComponentAtNode(div);
});
