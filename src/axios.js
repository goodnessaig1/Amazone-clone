import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001/clone-7f4a5/us-central1/api'
})

export default instance