require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const postRouter = require('./routes/post.route');
const userRouter = require('./routes/user.route');
const session = require('express-session');
const redis = require('redis');
const cors = require('cors');

// ✅ Classic constructor syntax for v5
const RedisStore = require('connect-redis')(session);

const { MONGO_USER, MONGO_PASSWORD, REDIS_URL, MONGO_IP, MONGO_PORT, SESSION_SECRET, REDIS_PORT } = require("./config/config");

// ✅ Classic Redis v3 client
const redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT
});

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL)
    .then(() => console.log("Connected To MongoDB!"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
app.enable('trust proxy');
app.use(cors({}))

// ✅ Use Redis session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      resave: false,
      saveUninitialized: false,
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Salom sizga!!!</h1>");
  console.log('It is running')
});

app.use('/posts', postRouter);
app.use('/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server is running on: ${port}`));
