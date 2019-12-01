import React from 'react';
import ReactDOM from 'react-dom';
import Forms from './SearchMessage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchMessage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
