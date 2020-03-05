import React from "react";
import Connecteur from '../connecteur/Connecteur'
import qs from 'querystring';

export default class RecetteForm extends React.Component{

    state = {
        title: '',
        description: ''
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    postRecette = e => {
        e.preventDefault()
        Connecteur.post('/recette', qs.stringify(this.state), {
            headers: { Authorization: 'Bearer ' + this.props.token }
        })
            .then(res => {
                if(res.status === 200) alert('Votre recette a bien été postée ! ♥')
                else alert('bite')
            })
            .catch(console.error)
    }

    render(){
        return (
            <div>
                <h1>Ajouter des recettes</h1>
                <div className="w-login">
                    <form>
                        <input type="text" name="title" value={this.state.title} placeholder="Title" onChange={this.handleChange}/>
                        <textarea name="description" value={this.state.description} placeholder="Description" onChange={this.handleChange}></textarea>
                        <input type="submit" value="Poster" onClick={this.postRecette}/>
                    </form>
                </div>
            </div>
        )
    }
}