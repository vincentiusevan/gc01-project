import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = new HttpLink({
  uri: 'https://ex-gc01p3.vincsevan.my.id',
});

const authLink = new SetContextLink(async ({ headers }) => {
  const token = await SecureStore.getItemAsync('access_token');

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
