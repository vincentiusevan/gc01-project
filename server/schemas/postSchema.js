import Post from '../models/Post.js';

export const postTypeDefs = `#graphql
type Comment {
  content: String
  username: String
  createdAt: String
  updatedAt: String
}

type Like {
  username: String
  createdAt: String
  updatedAt: String
}


type PostAuthor {
  _id: ID
  name: String
  username: String
  email: String
}


  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: ID
    author: PostAuthor
    comments: [Comment]
    likes: [Like]
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

input CommentInput {
  content: String
}

type Mutation {
    addPost(newPost: PostInput): String
    commentPost(postId: ID, comment: CommentInput): String
    likePost(postId: ID): String
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
    commentPost: async (_, args, contextValue) => {
      const user = await contextValue.authN();

      const { postId, comment } = args;
      const message = await Post.commentPost(postId, { ...comment, username: user.username });

      return message;
    },
    likePost: async (_, args, contextValue) => {
      const user = await contextValue.authN();

      const { postId } = args;
      const message = await Post.likePost(postId, user.username);

      return message;
    },
  },
};
