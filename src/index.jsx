import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import App from './App';

const host = new URLSearchParams(window.location.search).get('host');

ReactDOM.render(
  // <AppBridgeProvider config = {{
  //     apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
  //     host: host,
  //     forceRedirect: true,
  //   }}>
    <AppProvider i18n={{}}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </AppProvider>,
  document.getElementById('root')
);
