import axios from 'axios';

axios.defaults.baseURL = 'https://marketplace-users-ms.onrender.com';
//axios.defaults.baseURL = 'http://localhost:8081';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

export const getAuthToken = () => {
    return window.localStorage.getItem('token');
};

export const setAuthHeader = (token) => {
    if (token !== null) {
      window.localStorage.setItem("token", token);
    } else {
      window.localStorage.removeItem("token");
    }
};


export const request = (method, url, data) => {

    let headers = {};
    if (getAuthToken() !== null && getAuthToken() !== "null") {
        headers = {'Authorization': `Bearer ${getAuthToken()}`};
    }

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data});
};

export default axios;

