import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

let db = null;

export const client = new MongoClient(uri);

function connect() {
  db = client.db(dbName);

  return db;
}

export function getDB() {
  if (!db) return connect();
  return db;
}
