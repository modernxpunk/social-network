import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/Context.js'
import axios from 'axios'
import authStyles from './../styles/auth.module.css'

export default function Auth() {
	const {setIsAuth, username, setUsername} = useContext(AuthContext)
	const [password, setPassword] = useState('')
	const [isSignIn, setIsSignIn] = useState(false)

	const handleSubmit = async (event) => {
		event.preventDefault();
		await axios.post(`http://localhost:5000/auth/${isSignIn ? 'registration' : 'login'}`, {
			"username": username,
			"password": password
		}).then(() => {
			setUsername(username)
			setIsAuth(true)
		})
	};

	return (
		<div className={authStyles['auth']}>
			<div className={authStyles['inputs']}>
				<input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username"/>
				<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
				<input type="submit" value={isSignIn ? "Sign Up" : "Sign In"} onClick={handleSubmit}/>
			</div>
			<div className={authStyles["signIn"]}>
				<p className={authStyles["signInText"]} onClick={() => setIsSignIn(!isSignIn)}>{isSignIn ? "Sign In" : "Sign Up"}</p>
			</div>
		</div>
	);
}