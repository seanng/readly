import React from 'react';
import { render } from 'react-dom';
import { DashPopup } from 'components';
import 'assets/styles/tailwind.css';
import './index.css';

render(<DashPopup />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
