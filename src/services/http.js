import axios from 'axios'

const axioInstace = axios.create({
    baseURL: import.meta.env.URL_API_FIPE,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Access-Control-Allow-Credentials': true
    }

})


export default axioInstace