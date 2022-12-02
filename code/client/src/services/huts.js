import { SERVER_URL } from "./config";
import axios from 'axios';

const huts = {
  getHuts: () => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/huts`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },

  getHutDetails: (hutId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/huts/${hutId}`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },

  createHut: (data) => {
    return new Promise((resolve, reject) => {
      axios.post(`${SERVER_URL}/huts`, data, { withCredentials: true })
        .then(() => resolve())
        .catch(err => reject(err.response.data.error));
    })
  }
}

export default huts