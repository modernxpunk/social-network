const User = require('./models/User.js')
const {hashSync, compareSync} = require('bcryptjs')

class authController {
	async registration(req, res) {
		try {
			const {username, password} = req.body
			const user = await User.findOne({username})
			if (user) {
				return res.status(400).json({message: "user with this username has exist"})
			}
			const hash_password = hashSync(password)
			const new_user = new User({
				username, password: hash_password
			})
			await new_user.save()
			return res.json({message: "registration has been success"})
		} catch(err) {
			console.log(err)
			return res.status(400).json({message: "Registration error"})
		}
	}

	async login(req, res) {
		try {
			const {username, password} = req.body
			const user = await User.findOne({username})
			if (!user) {
				return res.status(400).json({message: "user with this username doesn't has exist"})
			}
			const validate = compareSync(password, user.password)
			if (!validate) {
				return res.json({message: "Invalid password"})
			}
			return res.json({message: "login has been success"})
		} catch(err) {
			console.log(err)
			return res.status(400).json({message: "Login error"})
		}
	}

	async getUsers(req, res) {
		try {
			const users = await User.find()
			return res.json({message: users})
		} catch(err) {
			console.log(err)
		}
	}

	async updateMessage(req, res) {
		try {
			const {from: sender, to: receiver, message} = req.body

			const from = await User.findOne({username: sender})
			const to = await User.findOne({username: receiver})

			const newMessage = {date: Date.now(), message}

			if (from.messages.get(to.username)) {
				from.messages.set(to.username, [...from.messages.get(to.username), {...newMessage, who: from.username}])
			} else {
				from.messages.set(to.username, [{...newMessage, who: from.username}])
			}

			if (to.messages.get(from.username)) {
				to.messages.set(from.username, [...to.messages.get(from.username), {...newMessage, who: from.username}])				
			} else {
				to.messages.set(from.username, [{...newMessage, who: from.username}])
			}
			
			await from.save()
			await to.save()

			return res.json({message: "update message success"})
		} catch(err) {
			console.log(err)
			return res.status(400).json({message: "Update message error"})
		}
	}

	async getMessages(req, res) {
		try {
			const {from, to} = req.body
			const user = await User.findOne({username: from})
			return res.json(user.messages.get(to))
		} catch(err) {
			console.log(err)
			return res.status(400).json({message: "Get messages error"})
		}
	}
}

module.exports = new authController