import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { register } from './ServiceWorker';

import './style.css';

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);

register();
