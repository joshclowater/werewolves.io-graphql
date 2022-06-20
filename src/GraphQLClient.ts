import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
} from "@apollo/client";
import { createAuthLink, AUTH_TYPE, AuthOptions } from 'aws-appsync-auth-link';
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link';
import appSyncConfig from "./aws-exports";

const url = appSyncConfig.aws_appsync_graphqlEndpoint;
const region = appSyncConfig.aws_appsync_region;
const auth: AuthOptions = {
  type: AUTH_TYPE.API_KEY,
  apiKey: appSyncConfig.aws_appsync_apiKey,
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
