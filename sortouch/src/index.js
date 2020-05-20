import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const targets = document.querySelectorAll('.erw-root');
Array.prototype.forEach.call(targets, target => {
    const id = target.dataset.id;
    const settings = window.erwSettings[id];
    console.log(settings)
    ReactDOM.render(<App settings={settings} />, target)
});

serviceWorker.unregister();