import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import axios from 'axios'
class App extends Component {
    constructor() {
        super()
        this.state = {
            fullname: '',
            username: '',
            email: '',
            password: ''
        }
        this.changefullname = this.changefullname.bind(this)
        this.changeusername = this.changeusername.bind(this)
        this.changeemail = this.changeemail.bind(this)
        this.password = this.password.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

    }
    changefullname(event) {
        this.setState({
            fullname: event.target.value
        })

    }
    changeusername(event) {
        this.setState({
            username: event.target.value
        })

    }
    changeemail(event) {
        this.setState({
            email: event.target.value
        })

    }
    password(event) {
        this.setState({
            password: event.target.value
        })

    }
    onSubmit(event) {
        event.preventDefault()
        const requster = {
            fullname: this.state.fullname,
            username: this.state.username,
            email: this.state.email,
            password: this.state.password

        }
        axios.post('http://localhost:4000/app/signup', requster)
            .then(res => console.log(res.data))
        this.setState({
            fullname: '',
            username: '',
            email: '',
            password: ''

        })
    }

    render() {
        return (
            <div>
                <div className='container'>
                    <div className='from-div'>
                        <form onSubmit={this.onSubmit}>
                            <input type='text'
                                placeholder='fullname'
                                onChange={this.changefullname}
                                value={this.state.fullname}
                                className='form-control form-group'
                            />
                            <input type='text'
                                placeholder='username'
                                onChange={this.changeusername}
                                value={this.state.username}
                                className='form-control form-group'
                            />
                            <input type='text'
                                placeholder='email'
                                onChange={this.changeemail}
                                value={this.state.email}
                                className='form-control form-group'
                            />
                            <input type='password'
                                placeholder='password'
                                onChange={this.password}
                                value={this.state.password}
                                className='form-control form-group'
                            />
                            <input type='submit' className='btn btn-danger btn-block' value='Submit' />

                        </form>

                    </div>
                </div>

            </div>
        );
    }
}
export default App;