import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client';
import { createAuthLink, AUTH_TYPE, AuthOptions } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import amplifyConfig from './amplifyconfiguration.json';

const url = amplifyConfig.aws_appsync_graphqlEndpoint;
const region = amplifyConfig.aws_appsync_region;
const auth: AuthOptions = {
  type: AUTH_TYPE.API_KEY,
  apiKey: amplifyConfig.aws_appsync_apiKey,
};

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth })
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      Game: {
        fields: {
          players: {
            merge: true,
          }
        }
      }
    }
  })
});

export default client;
