import '@/assets/styles/index.scss';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

const container: any = document.getElementById('root');
const root = createRoot(container);

const render = () => {
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
};

render();
