import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://qa4-api.8basedev.com/clt4hk0o000000ajtbadoegep",
  headers: {
    authorization: 'Bearer 1771ef80-6546-4efa-ac12-f240b7fbf4bf'
  },
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
