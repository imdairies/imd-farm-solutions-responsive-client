import React from 'react';
import ReactDOM from 'react-dom';
import SearchSire from './SearchSemenInventory';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SearchSemenInventory />, div);
  ReactDOM.unmountComponentAtNode(div);
});
