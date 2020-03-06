import axios from "axios";

const A = axios.create({
    baseURL: "http://localhost:4200" 
})

A.attachToken = function(token){
    return {
        headers: { Authorization: 'Bearer ' + token }
    }
}

export default A