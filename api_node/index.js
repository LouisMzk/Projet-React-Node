const server = require("express")();
const { createConnection } = require("mysql2") ;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("./config.json");
const bodyParser = require("body-parser");
const cors = require('cors')

const db = createConnection(config.database)

const ready = query([`
    CREATE TABLE IF NOT EXISTS user (
        id integer AUTO_INCREMENT,
        username varchar(64) NOT NULL,
        password varchar(64) NOT NULL,
        PRIMARY KEY(id)
    )
`,`
    CREATE TABLE IF NOT EXISTS recette (
        id integer AUTO_INCREMENT,
        user_id integer NOT NULL,
        title varchar(64) NOT NULL,
        description text NOT NULL,
        PRIMARY KEY(id),
        FOREIGN KEY (user_id) REFERENCES user(id)
    )
`])

server.use(
    cors(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    async (req, res, next)=>{
        await ready
        next()
    }
);

server.listen(4200)

server.get("/recette/:id", (req, res) => {
    res.status(404).json(req.params.id)
});

server.get('/recettes', needToken, (req, res) => {
    query('SELECT * FROM recette WHERE user_id = ?', [req.user.id])
        .then( results => {
            if(!results) res.status(200).json([])
            if(!Array.isArray(results))
                results = [results]
            res.status(200).json(results)
        })
        .catch(error => res.sendStatus(500))
})

server.delete('/recette/:id', needToken, (req, res) => {
    const id = +req.params.id
    query('DELETE FROM recette WHERE id = ?', [id])
        .then(() => res.sendStatus(200))
        .catch(err => res.sendStatus(500))
})

server.post("/recette", needToken, (req, res) => {
    const recette = [
        req.user.id,
        req.body.title,
        req.body.description
    ]
    query(`INSERT INTO recette (user_id, title, description) VALUES ( ?, ?, ?)`, recette)
        .then(() => res.sendStatus(200))
        .catch(err => res.sendStatus(500))
})

server.post( '/login', async ( req, res ) => {

    const user = {
        username: req.body.username,
        password: hash(req.body.password)
    }
    try{
        let dbUser = await query('SELECT * FROM user WHERE username=?',[user.username])
        if(!dbUser){
            await query('INSERT INTO user (username,password) VALUES (?,?)',[user.username,user.password])
            dbUser = await query('SELECT id FROM user WHERE username=?',[user.username])
        
        }else{
            if(dbUser.password !== user.password)
            return res.status(403).json({error: 'Password is invalid'})
        }
        user.id = dbUser.id
    }catch(err){
        console.error(err)
    }
    const token = newToken(user)
    res.status(200).json({ token })
})


function needToken( req, res, next ){
    const header = req.headers['authorization']
    const token = header && header.split(/\s+/)[1]
    if(!token) return res.status(401).json({error: 'Access yoken is needed'})
    jwt.verify( token, config.secret, (error, user) => {
        if(error) return res.status(403).json({error: 'Access yoken is invalid'})
        req.user = user
        next()
    })
}

function newToken( user ){
    return jwt.sign( user, config.secret, {expiresIn: '1h'} )
}

function hash(password ){
    return crypto.createHash('sha256').update( password + config.secret ).digest('hex')
}

async function query(requests, values){
    if(!Array.isArray(requests)) requests = [requests]
    const results = await Promise.all(requests.map( request => {
        return new Promise( (res, rej) => {
            db.query(request, values, (error, results) => {
                if(error) rej(error)
                else {
                    if(Array.isArray(results)){
                        if(results.length === 1){
                            return res(results[0])
                        }else if(results.length === 0){
                            return res(false)
                        }
                    }
                    res(results)
                }
            })
        })
    }))
    if(results.length === 1){
        return results[0]
    }else if(results.length === 0){
        return false
    }
    return results
}