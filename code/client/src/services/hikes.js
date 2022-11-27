import { SERVER_URL } from "./config";
import axios from 'axios';

const hikes = {
  getHikes: () => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes`)
        .then(res => resolve(res.data))
        .catch(err => reject(err.response.data.error));
    })
  },

  getHikeDetails: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}`)
        .then(res => resolve(res.data))
        .catch(err => reject(err.response.data.error));
    })
  },

  getHikeGPXFile: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}/download`, { withCredentials: true })
        .then(res => resolve(res.data))
        .catch(err => reject(err.response.data.error));
    })
  },

  //   createHike: (data) => {
  //     return new Promise((resolve, reject) => {
  //         axios.post(`${SERVER_URL}/hikes`, {})
  //     })
  //   }
}

export default hikes
