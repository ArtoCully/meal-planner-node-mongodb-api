require('dotenv').config()
const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

const MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(MONGO_URL || config.connectionString, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../users/user.model'),
  Recipe: require('../recipes/recipe.model'),
};
