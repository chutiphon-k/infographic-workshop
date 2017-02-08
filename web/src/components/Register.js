import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import axios from 'axios'

export default class Register extends Component {

	state = {
		status: ''
	}

	loggedIn(e){
		e.preventDefault()
		let { username, nickname, password, password2 } = this.refs
		let user = {
			username: username.value,
			nickname: nickname.value,
			password: password.value,
			password2: password2.value
		}
		axios.post('http://192.168.10.39:4000/users', user)
		.then((res) => {
			console.log(res)
			console.log(res.data)
			browserHistory.push('/login')
		}).catch((err) => {
			console.log(err)
		})
		console.log(user)
		// console.log(e.target.password.value)
	}

	render(){
		return (
			<div>
				<form onSubmit={this.loggedIn.bind(this)}>
					Username : <input ref='username' type='text'/>
					<br />
					Nickname : <input ref='nickname' type='text'/>
					<br />
					Password : <input ref='password' type='password'/>
					<br />					
					Password Again : <input ref='password2' type='password'/>
					<br />
					<button type='submit'>Submit</button>
				</form>
			</div>
		)
	}
}