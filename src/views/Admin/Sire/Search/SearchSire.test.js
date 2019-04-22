import React from 'react';
import ReactDOM from 'react-dom';
import Forms from './SearchSire';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchSire />, div);
  ReactDOM.unmountComponentAtNode(div);
});
