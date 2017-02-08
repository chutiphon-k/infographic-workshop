import React, { Component } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { browserHistory } from 'react-router'
import './login.css'

export default class Login extends Component {

	state = {
		status: ''
	}

	loggedIn(e){
		e.preventDefault()
		let { username, password } = this.refs
		let user = {
			username: username.value,
			password: password.value
		}
		axios.post('http://192.168.10.39:4000/auth', user)
		.then((res) => {
			console.log(res.data)
			Cookies.set('token', res.data.token)
			Cookies.set('username', res.data.username)
			console.log(Cookies.get())
			browserHistory.push('/')
		}).catch((err) => {
			console.log(err)
		})
	}

	render(){
		return (
			<div>
				<form onSubmit={this.loggedIn.bind(this)}>
					Username : <input ref='username' type='text'/>
					<br />
					Password : <input ref='password' type='password'/>
					<br />
					<button type='submit'>Login</button>
				</form>
			</div>
		)
	}
}