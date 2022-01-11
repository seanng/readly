import React from 'react';
import { render } from 'react-dom';
import { Popup } from 'ui';
import 'assets/styles/tailwind.css';
import './index.css';

render(<Popup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
