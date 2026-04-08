import { ObjectId } from 'mongodb';
import { getDB } from '../config/mongodb.js';
import { hashPassword, comparePassword } from '../helpers/bcrypt.js';
import emailValidator from 'email-validator';
import { signToken } from '../helpers/jwt.js';

export default class User {
  static getCollection() {
    const db = getDB();
    const collection = db.collection('users');

    return collection;
  }

  static async register(payload) {
    const collection = this.getCollection();

    if (!payload.name) throw new Error('Name is required');
    if (!payload.username) throw new Error('Username is required');
    if (!payload.email) throw new Error('Email is required');
    if (!payload.password) throw new Error('Password is required');
    if (payload.password.length < 5) throw new Error('Password minimum 5 characters');

    if (!emailValidator.validate(payload.email)) throw new Error('Invalid email format');

    const existingUsername = await collection.findOne({ username: payload.username });
    if (existingUsername) throw new Error('Username already taken');

    const existingEmail = await collection.findOne({ email: payload.email });
    if (existingEmail) throw new Error('Email already registered');

    payload.password = hashPassword(payload.password);
    await collection.insertOne(payload);

    return 'Register berhasil';
  }

  static async login(username, password) {
    const collection = this.getCollection();

    const user = await collection.findOne({ username });
    if (!user) throw new Error('Invalid username/password');

    const isValid = comparePassword(password, user.password);
    if (!isValid) throw new Error('Invalid username/password');

    const token = signToken({ _id: user._id, username: user.username });

    return token;
  }

  static async getUserById(id) {
    const collection = this.getCollection();
    const _id = new ObjectId(id);
    const [user] = await collection
      .aggregate([
        {
          $match: { _id },
        },
        {
          $lookup: {
            from: 'follows',
            localField: '_id',
            foreignField: 'followerId',
            as: 'followingConnections',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'followingConnections.followingId',
            foreignField: '_id',
            as: 'followings',
          },
        },
        {
          $lookup: {
            from: 'follows',
            localField: '_id',
            foreignField: 'followingId',
            as: 'followerConnections',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'followerConnections.followerId',
            foreignField: '_id',
            as: 'followers',
          },
        },
        {
          $project: {
            password: 0,
            followingConnections: 0,
            followerConnections: 0,
            'followers.password': 0,
            'followings.password': 0,
          },
        },
      ])
      .toArray();

    return user;
  }

  static async findByPk(id) {
    const collection = this.getCollection();
    const _id = new ObjectId(id);
    const user = await collection.findOne({ _id });

    return user;
  }

  static async searchUser(query) {
    const collection = this.getCollection();

    const users = await collection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } },
        ],
      })
      .toArray();

    return users;
  }
}
