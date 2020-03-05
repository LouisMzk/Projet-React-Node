import React from "react";
import Connecteur from "../connecteur/Connecteur";
import qs from 'querystring'
import RecetteForm from "./RecetteForm";

class App extends React.Component{

    token = ''

    state = {
        username: '',
        password: '',
        hasToken: false
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    handleLogin = e => {
        e.preventDefault()
        Connecteur.post('/login', qs.stringify(this.state))
            .then(res => {
                this.token = res.data.token
                this.setState({ hasToken: true })
            })
            .catch(console.error)
    }

    render() {
        if(this.state.hasToken)
        return <RecetteForm token={this.token}/>
        return(
            <div className="w-login">
                <form>
                    <input type="text" name="username" value={this.state.username} placeholder="pseudo" onChange={this.handleChange}/>
                    <input type="password" name="password" value={this.state.password} placeholder="password" onChange={this.handleChange}/>
                    <input type="submit" value="Log in" onClick={this.handleLogin}/>
                </form>
            </div>
        );
    }
}

export default App;