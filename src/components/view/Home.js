import React, {useContext, useState, useEffect, useMemo} from 'react'
import {Link} from 'react-router-dom'
import {AuthContext} from '../context/Context'
import axios from 'axios'
import home from '../styles/home.module.css'
import edit from '../../assets/edit.png'
import {timeValidation} from "../../scripts/timeValid";
import {Avatar} from "@material-ui/core";

const Home = React.memo(() => {
	const {username: myUsername} = useContext(AuthContext)
	const [friends, setFriends] = useState([])
	const [search, setSearch] = useState('')
	let cachedFriends = null

	useEffect(() => {
		async function getUsers() {
			await axios.get(`http://localhost:5000/auth/users`)
				.then(res => {
					setFriends(res.data.message)
					cachedFriends = res.data.message
				})
		}
		getUsers()
	}, [])

	cachedFriends = useMemo(() => {
		if (search)
			return friends.filter(({username}) => username.includes(search))
		return friends
	}, [friends, search])

	return (
		<React.Fragment>
			<div className={home["navigation-bar"]}>
				<div className={home["edit-chats-edit-icon"]}>
					<div className={home["edit"]}>
						<p>Edit</p>
					</div>
					<div className={home["name-chats"]}>
						<p>Chats</p>
					</div>
					<div className={home["edit-icon"]}>
						<img src={edit} alt="edit-icon" />
					</div>
				</div>
				<div className={home["search"]}>
					<input type="text" placeholder="Search for messages or users" value={search} onChange={e => setSearch(e.target.value)}/>
				</div>
			</div>
			<div className={home["chats"]}>
				{cachedFriends.map(friend => {
					const username = friend.username
					const lastSender = friend.messages[myUsername]
					const lastMessage = lastSender ? lastSender[lastSender.length - 1] : null
					const dateOfMessage = lastMessage ? lastMessage.date : null
					return (
						<Link to={`chat/${username}`} style={{textDecoration: 'none', color: 'inherit'}} key={friend._id}>
							<div className={home["chat"]}>
								<div className={home["left"]}>
									<div className={home["avatar"]}>
										<Avatar style={{
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											width: "45px",
											height: "45px"
										}}>{username[0].toUpperCase()}</Avatar>
									</div>
									<div className={home["data"]}>
										<div className={home["name-message"]}>
											<h4 className={home["name"]}>{username}</h4>
											<h4 className={home["message"]}>
												{lastMessage && (myUsername === lastMessage.who ? `You: ${lastMessage.message}` : lastMessage.message)}
											</h4>
										</div>
									</div>
								</div>
								<div className={home["right"]}>
									<div className={home["date"]}>
										<p>{dateOfMessage && timeValidation(dateOfMessage)}</p>
									</div>
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		</React.Fragment>
	)
})

export default Home