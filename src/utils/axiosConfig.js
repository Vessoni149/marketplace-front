
import axios from 'axios';


const instance = axios.create({
    baseURL: 'http://localhost:8081', 
    //baseURL: 'https://marketplace-users-ms.onrender.com',
    withCredentials: true // Habilitar el intercambio de cookies
});


export default instance;
