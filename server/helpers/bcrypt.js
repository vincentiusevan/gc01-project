import bcrypt from 'bcryptjs';

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}
