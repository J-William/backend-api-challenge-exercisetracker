const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const MONGO_URI = process.env['MONGO_URI']
const UserDao = require('./UserDao.js')
const client = new MongoClient(MONGO_URI)
const db = client.db('exercise_tracker')
const users = db.collection('users')
const dao = new UserDao(client)
module.exports = { client, db, users, ObjectId, dao }
