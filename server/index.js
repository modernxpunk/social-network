require('dotenv').config()
const ws = require('ws')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter.js')
const {isWhitelisted} = require("validator");

const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.c5vld.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const APP_PORT = process.env.APP_PORT
const WS_PORT = process.env.WS_PORT

const app = express()

app.use(express.json())
app.use(cors())
app.use('/auth', authRouter)

const main = async () => {
    try {
        await mongoose.connect(DB_URL)

        app.listen(APP_PORT, () => console.log(`App has been started on port ${APP_PORT}`))

        const clients = {}
        const wss = new ws.Server({port: WS_PORT}, () => console.log(`WebSocket has been started on port ${WS_PORT}`))

        wss.on('connection', ws => {
            ws.on('message', msg => {
                msg = JSON.parse(msg)
                const {sender, receiver} = msg
                if (msg.method === "connection") {
                    ws.sender = sender
                    ws.receiver = receiver
                }
                else if (msg.method === "message") {
                    const {message} = msg
                    wss.clients.forEach(client => {
                        if (ws.sender === client.sender && ws.receiver === client.receiver) {
                            client.send(JSON.stringify({message}))
                        } else if (ws.sender === client.receiver && ws.receiver === client.sender) {
                            client.send(JSON.stringify({message}))
                        }
                    })
                }
            })
        })
    } catch(err) {
        console.log(err)
    }
}

main()