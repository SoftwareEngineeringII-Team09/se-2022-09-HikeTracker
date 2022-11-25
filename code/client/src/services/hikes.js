import { SERVER_URL } from "./config";
import axios from 'axios';

const hikes = {
  getHikes: () => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },

  getHikeDetails: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },

  getHikeGPXFile: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}/download`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },

  //   createHike: (data) => {
  //     return new Promise((resolve, reject) => {
  //         axios.post(`${SERVER_URL}/hikes`, {})
  //     })
  //   }

  getPotentialPoints: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}/potentialStartEndPoints`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },

  updateHikeEndpoints: (hikeId, points) => {
    return new Promise((resolve, reject) => {
      axios.put(`${SERVER_URL}/hikes/${hikeId}/startEndPoints`, points)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },
}

export default hikes
