import React from 'react'
import { Router, IndexRoute, Route, browserHistory } from 'react-router'
import Cookies from 'js-cookie'
import App from './components/App'
import Home from './components/Home'
import About from './components/About'
import Login from './components/Login'
import Register from './components/Register'

function checkAuth(nextState, replace, cb){
	if(!Cookies.get('token')){
		replace({
			pathname: '/login',
			state: { nexPathname: nextState.location.pathname }
		})
	}

	cb()
}

function logOut(nextState, replace, cb){
	Cookies.remove('token')
	Cookies.remove('username')

	replace({
		pathname: '/login'
	})

	cb()
}

export default () => (
	<Router history={browserHistory}>
		<Route path='/' component={App}>
			<IndexRoute component={Home} onEnter={checkAuth}/>
			<Route path='about' component={About}/>
			<Route path='login' component={Login}/>
			<Route path='register' component={Register}/>
			<Route path='logout' onEnter={logOut}/>
		</Route>
	</Router>
)