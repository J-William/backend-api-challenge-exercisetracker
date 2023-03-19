const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient } = require("mongodb")
const UserDao = require('./crudOps.js')
require('dotenv').config()

const MONGO_URI = process.env['MONGO_URI']
const client = new MongoClient(MONGO_URI)
const dao = new UserDao(client)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

// Test page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// User creation endpoint
app.post('/api/users', (req, res) => {
	dao.createUser(req.body.username)
		.then((newId) => {
			res.json({_id: newId, username: req.body.username})
		})
		.catch((err) => {
			console.error(`creatUser invoke failed: ${err}`)
		})
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
