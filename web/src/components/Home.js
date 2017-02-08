import React from 'react'
import {Link} from 'react-router'
import $ from 'jquery'
import io from 'socket.io-client';
import Cookies from 'js-cookie'

var socket = io.connect('192.168.10.39:4000/');

function display(text){
  $('#chatPane').append(text+'<br/>')
}

const Home =  React.createClass({

  getInitialState(){
    return {
      users: {},
      html: ''
    }
  },

  appendHtml(html){
    return this.state.html + html + '<br/>'
  },

  initSocketEvents(){
    var self = this
    socket.on('user joined', (data) => {
      let {users, username} = data

      self.setState({
        users: users, 
        html: self.appendHtml('<strong>' + username + '</strong> joined')
      })
    });
    
    socket.on('user left', (data) => {
      let {users, username} = data

      self.setState({
        users: users, 
        html: self.appendHtml('<strong>' + username + '</strong> lefted')
      })
    });

    socket.on('login', (data) => {
      let {users, username} = data

      self.setState({
        users: users, 
        html: self.appendHtml('Welcome <strong>' + username + '</strong>!')
      })
    });

    socket.on('new message', (data) => {
      self.setState({
        html: self.appendHtml('<strong>' + data.username + '</strong>: ' + data.message)
      })
    });
  },

  msgSubmitted(e){
    e.preventDefault()

    let msg = $('#msg').val()
    $('#msg').val('')

    socket.emit('new message', msg);
    this.setState({
      html: this.appendHtml('<strong>' + this.me + '</strong>: ' + msg)
    })
  },

  componentDidMount(){
    this.me = Cookies.get('username');

    this.initSocketEvents()
    socket.emit('new user', this.me);

    $('#msg').focus();
  },

	render(){
    let users = []
    for(let key in this.state.users){
      users.push(<li key={key}>{key}</li>)
    }

    return (
      <div className="chat-container">
        <nav className="navbar navbar-default ">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li className="active"><Link to='/'>Chat</Link></li>
                <li><Link to='/profile'>Edit Profile</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="">
          <div className="col-ms-4 col-sm-4 hidden-xs" >
            <strong>Users</strong><br/>
            <ul>{users}</ul>
          </div>
          <div className="col-ms-8 col-sm-8 col-xs-12">
            <form id="sendForm" onSubmit={this.msgSubmitted}>
              <div id="chatPane" style={{overflow:'auto'}} dangerouslySetInnerHTML={{ __html: this.state.html }}></div>
              <input type="text" id="msg" className="form-control input-width" autoComplete="off"/> <button className="btn btn-default" type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    )
	}
})


export default Home