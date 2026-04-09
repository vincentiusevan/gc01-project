import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://10.0.2.2:3000',
  }),
  cache: new InMemoryCache(),
});

export default client;
