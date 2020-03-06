import React from "react";
import Connecteur from "../connecteur/Connecteur";
import qs from 'querystring'
import RecetteForm from "./RecetteForm";
import RecetteList from './RecetteList'

class App extends React.Component{

    state = {
        username: '',
        password: '',
        hasToken: false,
        token: ''
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    handleLogin = e => {
        e.preventDefault()
        Connecteur.post('/login', qs.stringify(this.state))
            .then(res => {
                this.setState({ hasToken: true, token: res.data.token })
            })
            .catch(console.error)
    }

    render() {
        if(this.state.hasToken)
        return <RecetteList token={this.state.token}/>
        return(
            <div className="component">
                <h1>Connection</h1>
                <div>
                    <form>
                        <input type="text" name="username" value={this.state.username} placeholder="pseudo" onChange={this.handleChange}/>
                        <input type="password" name="password" value={this.state.password} placeholder="password" onChange={this.handleChange}/>
                        <input type="submit" value="Log in" onClick={this.handleLogin}/>
                    </form>
                </div>
            </div>
        );
    }
}

export default App;