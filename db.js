const mongoose = require('mongoose');
require('dotenv').config()

const mongoUrl = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PWD}@${process.env.MONGO_DB_HOST}/${process.env.MONGO_DB_NAME}?authSource=admin&replicaSet=atlas-de45xw-shard-0&readPreference=primary&ssl=true`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function () {
    console.log('MongoDB connected');
});

exports.db;