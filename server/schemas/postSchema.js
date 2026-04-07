export const postTypeDefs = `#graphql
  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    createdAt: String
    updatedAt: String
  }

  type Query {
    getPosts: [Post]
  }
`;

export const postResolvers = {
  Query: {
    getPosts: async () => {
      return [];
    },
  },
};
