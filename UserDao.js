const ObjectId = require('mongodb').ObjectId

class UserDao {
	constructor(client) {
		this._client = client;
		this.connect();
	}

	connect() {
		try {
			this._db = this._client.db('exercise_tracker');
			this._coll = this._db.collection('users');
		} catch (error) {
			console.error(`UserDao connection error: ${error}`);
		}
	}

	async createUser(userName) {
		try {
			const result = await this._coll.insertOne({
				username: userName
			})
			return result.insertedId.toString();
		} catch (error) {
			console.error(`createUser error: ${error}`)
		}
	}

	async getUsers() {
		try {
			let users = []
			const cursor = await this._coll.find(
				{},
				{ username: 1 }
			)
			while (await cursor.hasNext()) {
				users.push(
					await cursor.next()
				)
			}
			return users;
		} catch (error) {
			console.error(`getUsers error: ${error}`)
		}
	}

	async logExercise(id, description, duration, date) {
		try {
			const oid = new ObjectId(id)
			const result = await this._coll.findOneAndUpdate(
				{ _id: oid },
				{
					$push: {
						log: {
							'description': description,
							'duration': duration,
							'date': date
						}
					},
					$inc: { count: 1 }
				},
				{ upsert: true }
			)

			return result.value.username;

		} catch (error) {
			console.error(`logExercise error: ${error}`)
		}
	}

	async getLogs(id) {
		try {
			const oid = new ObjectId(id)
			return await this._coll.findOne(
				{ _id: oid }
			)			
		} catch (error) {
			console.error(`getLogs error: ${error}`)
		}
	}
}

module.exports = UserDao;






