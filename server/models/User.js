const {Schema, model} = require('mongoose')

const User = new Schema({
	username: {type: String, unique: true, required: true},
	password: {type: String, required: true},
	messages: {
		type: Map,
		of: [Schema.Types.Mixed],
		default: {}
	}
})

module.exports = model('User', User)
