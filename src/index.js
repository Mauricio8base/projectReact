import 'dotenv/config';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.REACT_APP_URI + process.env.REACT_APP_WORKSPACE,
  headers: {
    authorization: 'Bearer ' + process.env.REACT_APP_API_TOKEN,
    environment: process.env.REACT_APP_ENV,
  },
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
