
import React from 'react'
import Connecteur from '../connecteur/Connecteur'
import RecetteForm from './RecetteForm';

export default class RecetteList extends React.Component {

    state = {
        currentRecette: null,
        recettes: []
    }

    componentDidMount(){
        this.refreshList()
    }

    refreshList = () => {
        Connecteur.get('/recettes', Connecteur.attachToken(this.props.token))
            .then( res => {
                if(res.status !== 200) throw Error('Oups');
                this.setState({ recettes: res.data })
            })
    }

    delete(index){
        const recette = this.state.recettes[index]
        Connecteur.delete('/recette/' + recette.id, Connecteur.attachToken(this.props.token))
            .then( res => {
                if(res.status !== 200) throw Error('Oups');
                this.refreshList()
            })
    }

    select = (index) => {
        this.setState({ 
            currentRecette: this.state.recettes[index] 
        })
    }

    render(){
        return (
            <div className="component">
                <div className="list">
                    {this.state.recettes.map( (recette, index) => (
                        <div onClick={() => this.select(index)}>
                            <h1>{recette.title}</h1>
                            <pre>{recette.description}</pre>
                            <button type="button" onClick={() => this.delete(index)}> X </button>
                        </div>
                    ))}
                </div>
                <RecetteForm token={this.props.token} onPost={this.refreshList} recette={this.state.currentRecette}/>
            </div>
        )
    }

}