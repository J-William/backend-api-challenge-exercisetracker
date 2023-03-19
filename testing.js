const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const MONGO_URI = process.env['MONGO_URI']
const UserDao = require('./UserDao.js')
const client = new MongoClient(MONGO_URI)
const db = client.db('exercise_tracker')
const users = db.collection('users')
const dao = new UserDao(client)

const id = '6417671c17b7e0cf18501fc3'
const oid = new ObjectId(id)

module.exports = { client, db, users, ObjectId, dao, id, oid }
