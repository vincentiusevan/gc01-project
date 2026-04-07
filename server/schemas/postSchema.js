import Post from '../models/Post.js';

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
    getPostById(id: ID): Post
  }

  input PostInput {
  content: String
  tags: [String]
  imgUrl: String
}

type Mutation {
    addPost(newPost: PostInput): String
}
`;

export const postResolvers = {
  Query: {
    getPosts: async () => {
      const posts = await Post.getPosts();
      return posts;
    },
    getPostById: async (_, args) => {
      const { id } = args;
      const post = await Post.getPostById(id);

      return post;
    },
  },
  Mutation: {
    addPost: async (_, args, contextValue) => {
      const user = await contextValue.authN(); // ini akan throw error kalau tidak login

      const { content, tags, imgUrl } = args.newPost;
      const authorId = user._id;

      const message = await Post.addPost({ content, tags, imgUrl, authorId });

      return message;
    },
  },
};
