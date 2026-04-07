import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { userTypeDefs, userResolvers } from './schemas/userSchema.js';
import { postTypeDefs, postResolvers } from './schemas/postSchema.js';
import authN from './helpers/authN.js';

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs],
  resolvers: [userResolvers, postResolvers],
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
  context: async ({ req, res }) => {
    return { authN: async () => authN(req) };
  },
});

console.log(`🚀  Server ready at: ${url}`);
