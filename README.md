# EX

A mobile social media app. You can register, post with an image and tags, comment, like, search for people, and follow them.

- **App:** React Native with Expo, Apollo Client, React Navigation
- **Server:** Apollo Server (GraphQL), MongoDB, Redis, JWT

The list of posts is cached in Redis. The cache is cleared when a post, comment, or like changes it. Images are uploaded to Cloudinary from the app.

## Running it

You need Node.js, a MongoDB database, and a Redis server.

Server:

```bash
cd server
npm install
cp .env-example .env
node index.js
```

Fill in `.env` first: `MONGODB_URI`, `MONGODB_DBNAME`, `JWT_SECRET`, `REDIS_URI`, and `PORT`. `PORT` has no default.

App:

```bash
cd app
npm install
npm start
```

The app talks to the deployed server. To use your local one, change `uri` in `app/config/apollo.js`.
