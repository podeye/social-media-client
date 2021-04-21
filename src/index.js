import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {InMemoryCache,
        createHttpLink,
        ApolloProvider,
        ApolloClient} from '@apollo/client';
import {setContext} from 'apollo-link-context';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
})

const authLink = setContext(()=>{
  const token = localStorage.getItem("jwtToken");
  return{
    headers:{
      Authorization: token?`Bearer ${token}`: ''
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})


ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
