import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.16.107:3333'
});

export { api };