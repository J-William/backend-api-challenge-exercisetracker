

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
}

module.exports = UserDao;






