import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://ramp-indexer.up.railway.app/';

export const client = new GraphQLClient(endpoint);