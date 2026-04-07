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
}
