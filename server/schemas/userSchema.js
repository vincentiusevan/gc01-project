import User from '../models/User.js';

export const userTypeDefs = `#graphql
  type FollowDetail {
    _id: ID
    name: String
    username: String
    email: String
  }

  type User {
    _id: ID
    name: String
    username: String
    email: String
    followers: [FollowDetail]
    followings: [FollowDetail]
  }

  type Query {
    _empty: String
    searchUser(query: String): [User]
    getUserById(id: ID!): User
  }

  input RegisterInput {
    name: String
    username: String
    email: String
    password: String
  }

  type Mutation {
    register(newUser: RegisterInput): String
    login(username: String, password: String): String
  }
`;

export const userResolvers = {
  Mutation: {
    register: async (_, args) => {
      const { name, username, email, password } = args.newUser;
      const message = await User.register({ name, username, email, password });
      return message;
    },
    login: async (_, args) => {
      const { username, password } = args;
      const token = await User.login(username, password);

      return token;
    },
  },
  Query: {
    searchUser: async (_, args, contextValue) => {
      await contextValue.authN();

      const { query } = args;
      const users = await User.searchUser(query);

      return users;
    },
    getUserById: async (_, args, contextValue) => {
      await contextValue.authN();

      const { id } = args;
      const user = await User.getUserById(id);

      return user;
    },
  },
};
