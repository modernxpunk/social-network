import React, {useContext, useEffect, useRef, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {AuthContext} from '../context/Context.js'
import chatStyle from './../styles/chat.module.css'
import axios from 'axios'
import back from '../../assets/back.png'
import {timeValidation} from "../../scripts/timeValid";
import {Avatar} from "@material-ui/core";
import send from '../../assets/send.png'

const Chat = React.memo(() => {
	const {username: sender} = useContext(AuthContext)
	const {username: receiver} = useParams()
	const [chat, setChat] = useState([])
	const [newMessage, setNewMessage] = useState('')

	async function updateMessage(sender, receiver, newMessage) {
		await axios.post(`http://localhost:5000/auth/updateMessage`, {
			from: sender, to: receiver, message: newMessage
		})
	}

	const socket = useRef()

	async function getMessages() {
		await axios.post(`http://localhost:5000/auth/messages`, {from: sender, to: receiver})
			.then(res => {
				setChat(res.data)
			})
	}

	function connect() {
		socket.current = new WebSocket('ws://localhost:5001')
		socket.current.onopen = () => {
			socket.current.send(JSON.stringify({
				"method": "connection",
				"sender": sender,
				"receiver": receiver
			}))
		}
		socket.current.onmessage = async () => {
			await getMessages()
		}
		socket.current.onerror = () => {
			console.log('socket error')
		}
		socket.current.onclose = () => {
			console.log('socket close')
		}
	}

	useEffect(() => {
		connect()
		getMessages()
	}, [])

	async function submitNewMessage() {
		const sendNewMessage = newMessage.trim()
		if (sendNewMessage === '') return
		await updateMessage(sender, receiver, sendNewMessage)
		await getMessages()
		socket.current.send(JSON.stringify({
			"method": "message",
			"sender": sender,
			"receiver": receiver,
			"message": sendNewMessage
		}))
		setNewMessage('')
	}
	return (
		<>
			<div className={chatStyle['navigation']}>
				<Link to={'/home'} style={{display: "flex", textDecoration: "none", color: "white"}}>
					<div className={chatStyle['backToChats']}>
						<div className={chatStyle['iconBack']}>
							<img src={back} width="20px"/>
						</div>
						<div className={chat["text-chats"]}>
							<p>Chats</p>
						</div>
					</div>
				</Link>
				<div className={chatStyle["name-online"]}>
					<div className={chatStyle["name"]}>
						<p>{receiver}</p>
					</div>
					<div className={chatStyle["isOnline"]}>
						<p>last seen just now</p>
					</div>
				</div>
				<div className={chatStyle["avatar"]}>
					<Avatar style={{width: '40px', height: "40px"}}>{sender[0].toUpperCase()}</Avatar>
				</div>
			</div>
			<div className={chatStyle["chats"]}>
				{chat && chat.map(m =>
					<div className={`${chatStyle["chat"]} ${receiver === m.who ? chatStyle["sender"] : chatStyle["receiver"]}`}>
						<p className={chatStyle["chat-message"]}>
							{m.message}
							<span className="time">{timeValidation(m.date)}</span>
						</p>

					</div>
				)}
			</div>
			<div className={chatStyle["footer"]}>
				<div className={chatStyle["footer-wrap"]}>
					<input type="text" placeholder="Message" value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
					<img src={send} onClick={submitNewMessage}/>
				</div>
			</div>
		</>
	)
})

export default Chat
