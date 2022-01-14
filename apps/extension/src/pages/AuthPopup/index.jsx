import React from 'react';
import { render } from 'react-dom';
import { AuthPopup } from 'components';
import 'assets/styles/tailwind.css';
import './index.css';

render(<AuthPopup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
