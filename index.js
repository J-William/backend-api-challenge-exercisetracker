const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient } = require("mongodb")
const UserDao = require('./UserDao.js')
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
			res.json({ username: req.body.username, _id: newId })
		})
		.catch((err) => {
			console.error(`creatUser invoke failed: ${err}`)
		})
})

// Get all users
app.get('/api/users', (req, res) => {
	dao.getUsers()
		.then((users) => {
			res.send(users)
		})
		.catch((err) => {
			console.error(`getUsers invoke failed: ${err}`)
		})
})

// Post an exercise for a user
app.post('/api/users/:_id/exercises', (req, res) => {
	let date;
	if (req.body.date) {
		date = new Date(req.body.date);
	} else {
		date = new Date();
	}

	dao.logExercise(
		req.params._id,
		req.body.description,
		req.body.duration,
		date.toDateString()
	)
		.then((userName) => {
			res.json({
				username: userName,
				description: req.body.description,
				duration: req.body.duration,
				date: date.toDateString(),
				_id: req.params._id
			})
		})
		.catch((error) => {
			console.error(`logExercise invoke failed: ${error}`)
		})
})


const listener = app.listen(process.env.PORT || 3000, () => {
	console.log('Your app is listening on port ' + listener.address().port)
})
