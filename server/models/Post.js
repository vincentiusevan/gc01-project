import { ObjectId } from 'mongodb';
import { getDB } from '../config/mongodb.js';
import { redis } from '../config/redis.js';

export default class Post {
  static getCollection() {
    const db = getDB();
    const collection = db.collection('posts');

    return collection;
  }

  static async getPosts() {
    const cache = await redis.get('posts:all');
    if (cache) return JSON.parse(cache);

    const collection = this.getCollection();

    const posts = await collection
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            'author.password': 0,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ])
      .toArray();

    await redis.set('posts:all', JSON.stringify(posts));
    return posts;
  }

  static async getPostById(id) {
    const collection = this.getCollection();
    const _id = new ObjectId(id);

    const [post] = await collection
      .aggregate([
        {
          $match: { _id },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'authorId',
            foreignField: '_id',
            as: 'author',
          },
        },
        {
          $unwind: {
            path: '$author',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            'author.password': 0,
          },
        },
      ])
      .toArray();

    return post;
  }

  static async addPost(payload) {
    const collection = this.getCollection();

    if (!payload.content) throw new Error('Content is required');

    const newPost = {
      ...payload,
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.insertOne(newPost);
    await redis.del('posts:all');

    return 'Post berhasil ditambahkan';
  }

  static async commentPost(postId, commentPayload) {
    const collection = this.getCollection();
    const _id = new ObjectId(postId);

    if (!commentPayload.content) throw new Error('Comment content is required');

    const comment = {
      content: commentPayload.content,
      username: commentPayload.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id }, { $push: { comments: comment } });
    await redis.del('posts:all');

    return 'Komentar berhasil ditambahkan';
  }

  static async likePost(postId, username) {
    const collection = this.getCollection();
    const _id = new ObjectId(postId);

    const post = await collection.findOne({ _id });
    if (!post) throw new Error('Post not found');

    const alreadyLiked = post.likes.find((like) => like.username === username);
    if (alreadyLiked) {
      await collection.updateOne({ _id }, { $pull: { likes: { username } } });
      await redis.del('posts:all');
      return 'Post berhasil di-unlike';
    }

    const like = {
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.updateOne({ _id }, { $push: { likes: like } });
    await redis.del('posts:all');

    return 'Post berhasil di-like';
  }
}
