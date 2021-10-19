const Router = require('express')
const router = new Router()
const controller = require('./authController.js')

router.get('/users', controller.getUsers)
router.post('/messages', controller.getMessages)

router.post('/registration', controller.registration)
router.post('/login', controller.login)
router.post('/updateMessage', controller.updateMessage)

module.exports = router