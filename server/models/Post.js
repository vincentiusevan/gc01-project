import { ObjectId } from 'mongodb';
import { getDB } from '../config/mongodb.js';

export default class Post {
  static getCollection() {
    const db = getDB();
    const collection = db.collection('posts');

    return collection;
  }

  static async getPosts() {
    const collection = this.getCollection();

    const posts = await collection.find().sort({ createdAt: -1 }).toArray();

    return posts;
  }

  static async getPostById(id) {
    const collection = this.getCollection();
    const _id = new ObjectId(id);
    const post = await collection.findOne({ _id });

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

    return 'Post berhasil ditambahkan';
  }
}
