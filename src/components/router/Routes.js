import Auth from '../view/Auth'
import Chat from '../view/Chat'
import Home from "../view/Home";

export const privateRoutes = [
	{path: '/home', component: Home, exact: true},
	{path: '/chat/:username', component: Chat, exact: true}
]

export const publicRoutes = [
	{path: '/login', component: Auth, exact: true}
]