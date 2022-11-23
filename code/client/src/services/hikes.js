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

  getPotentialStartPoints: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}/potentialStartPoints`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },

  getPotentialArrivalPoints: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}/potentialArrivalPoints`)
        .then(res => resolve(res.data))
        .catch(err => reject(err));
    })
  },
}

export default hikes
