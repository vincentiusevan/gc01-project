import Follow from '../models/Follow.js';

export const followTypeDefs = `#graphql
  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  type Mutation {
    follow(followingId: ID): String
  }
`;

export const followResolvers = {
  Mutation: {
    follow: async (_, args, contextValue) => {
      const user = await contextValue.authN();

      const { followingId } = args;
      const message = await Follow.follow(followingId, String(user._id));

      return message;
    },
  },
};
