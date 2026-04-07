import User from '../models/User.js';
import { verifyToken } from './jwt.js';

export default async function authN(req) {
  const { authorization } = req.headers;
  if (!authorization) throw new Error('unauthorized');

  const [tokenType, tokenValue] = authorization.split(' ');
  if (tokenType !== 'Bearer') throw new Error('Invalid token');

  if (!tokenValue) throw new Error('Invalid token');

  const payload = verifyToken(tokenValue);

  const user = await User.getUserById(payload._id);
  if (!user) throw new Error('unauthorized');

  const { password, ...rest } = user;
  return rest;
}
