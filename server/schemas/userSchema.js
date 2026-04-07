import User from '../models/User.js';

export const userTypeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
  }

  type Query {
    _empty: String
  }

  input RegisterInput {
    name: String
    username: String
    email: String
    password: String
  }

  type Mutation {
    register(newUser: RegisterInput): String
  }
`;

export const userResolvers = {
  Mutation: {
    register: async (_, args) => {
      const { name, username, email, password } = args.newUser;
      const message = await User.register({ name, username, email, password });
      return message;
    },
  },
};
