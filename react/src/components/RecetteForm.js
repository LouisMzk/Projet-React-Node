import React from "react";
import Connecteur from '../connecteur/Connecteur'
import qs from 'querystring';

export default class RecetteForm extends React.Component{

    state = {
        title: this.props.recette ? this.props.recette.title : '',
        description: this.props.recette ? this.props.recette.description : ''
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value })

    postRecette = e => {
        e.preventDefault()
        Connecteur.post('/recette', qs.stringify(this.state), Connecteur.attachToken(this.props.token))
            .then(res => {
                if(res.status === 200) {
                    this.props.onPost()
                }
            })
            .catch(console.error)
    }

    render(){
        return (
            <div className="component">
                <h1>Ajoutez vos recette</h1>
                <div>
                    <form>
                        <input type="text" name="title" value={this.state.title} placeholder="Titre" onChange={this.handleChange}/>
                        <textarea name="description" cols="50" rows="20" value={this.state.description} placeholder="Description" onChange={this.handleChange}></textarea>
                        <input type="submit" value="Poster" onClick={this.postRecette}/>
                    </form>
                </div>
            </div>
        )
    }
}