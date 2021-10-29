import React, {useState} from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {AuthContext} from './components/context/Context.js'
import AppRouter from './components/router/AppRouter.js'
import './components/styles/reset.css'
import main from './components/styles/main.module.css'

function App() {
	const [isAuth, setIsAuth] = useState(false)
	const [username, setUsername] = useState('')

	return (
		<React.StrictMode>
			<AuthContext.Provider value={{isAuth, setIsAuth, username, setUsername}}>
				<BrowserRouter>
					<div className={main["wrapper"]}>
						<div className={main["telegram"]}>
							<AppRouter />
						</div>
					</div>
				</BrowserRouter>
			</AuthContext.Provider>
		</React.StrictMode>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))
