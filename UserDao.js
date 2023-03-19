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
							'duration': parseInt(duration),
							'date': new Date(date)
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

	async getLogs(id, from = new Date('1970-01-01'), to = new Date(), limit = 100) {
		try {
			console.log(`getLogs parameters: ${from}, ${to}, ${limit}`);
			const oid = new ObjectId(id)
			let result = await this._coll.aggregate([
				{ $match: { _id: oid } },
				{
					$project: {
						count: 1,
						log: {
							$filter: {
								input: "$log",
								as: "log",
								cond: {
									$and: [
										{ $gte: ["$$log.date", new Date(from)] },
										{ $lte: ["$$log.date", new Date(to)] }
									]
								}
							}
						}
					}
				},
				{ $project: { count: 1, log: { $slice: ["$log", parseInt(limit)] } } }
			]).limit(1).toArray()

			result = result[0]
			// Convert the dates to display format
			result.log.map(
				(entry) => {
					entry.date = entry.date.toDateString()
				}
			)
			return result;

		} catch (error) {
			console.error(`getLogs error: ${error}`)
		}
	}
}

module.exports = UserDao;






