import { ObjectId } from 'mongodb';
import { getDB } from '../config/mongodb.js';

export default class Follow {
  static getCollection() {
    const db = getDB();
    const collection = db.collection('follows');

    return collection;
  }

  static async follow(followingId, followerId) {
    const collection = this.getCollection();

    if (followingId === followerId) throw new Error('You cannot follow yourself');

    const existingFollow = await collection.findOne({
      followingId: new ObjectId(followingId),
      followerId: new ObjectId(followerId),
    });

    if (existingFollow) {
      await collection.deleteOne({ _id: existingFollow._id });
      return 'Unfollow berhasil';
    } else {
      await collection.insertOne({
        followingId: new ObjectId(followingId),
        followerId: new ObjectId(followerId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return 'Follow berhasil';
    }
  }
}
