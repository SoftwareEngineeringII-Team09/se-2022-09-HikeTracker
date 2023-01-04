import { SERVER_URL } from "./config";
import axios from 'axios';

const hikes = {
  getHikes: () => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes`)
        .then(res => resolve(res.data))
        .catch(err => reject(err.response ? err.response.data.error : err.message));
    })
  },

  getHikesForLocalGuide: (writerId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/writers/${writerId}`, { withCredentials: true })
        .then(res => resolve(res.data))
        .catch(err => reject(err.response.data.error));
    })
  },

  getHikeDetails: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}`)
        .then(res => resolve(res.data))
        .catch(err => reject(err.response ? err.response.data.error : err.message));
    })
  },

  getHikeGPXFile: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}/download`, { withCredentials: true })
        .then(res => resolve(res.data))
        .catch(err => reject(err.response ? err.response.data.error : err.message));
    })
  },

  createHike: (data) => {
    return new Promise((resolve, reject) => {
      axios.post(`${SERVER_URL}/hikes`, data, { withCredentials: true })
        .then(res => resolve(res.data))
        .catch(err => reject(err.response ? err.response.data.error : err.message));
    })
  },

  getPotentialPoints: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}/potentialStartEndPoints`, { withCredentials: true })
        .then(res => resolve(res.data))
        .catch(err => reject(err.response.data.error));
    })
  },

  updateHikeEndpoints: (hikeId, points) => {
    return new Promise((resolve, reject) => {
      axios.put(`${SERVER_URL}/hikes/${hikeId}/startEndPoints`, points, { withCredentials: true })
        .then(res => resolve(res.data))
        .catch(err => reject(err.response.data.error));
    })
  },

  updateReferencePoints: (hikeId, data) => {
    return new Promise((resolve, reject) => {
      axios.put(`${SERVER_URL}/hikes/${hikeId}/refPoints`, { referencePoints: data }, { withCredentials: true })
        .then(() => resolve())
        .catch(err => reject(err.response.data.error));
    })
  },

  getLinkableHuts: (hikeId) => {
    return new Promise((resolve, reject) => {
      axios.get(`${SERVER_URL}/hikes/${hikeId}/linkable-huts`, { withCredentials: true })
        .then(res => resolve(res.data.potentialHuts))
        .catch(err => reject(err.response.data.error));
    })
  },

  updateLinkedHuts: (hikeId, data) => {
    return new Promise((resolve, reject) => {
      axios.put(`${SERVER_URL}/hikes/${hikeId}/huts`, data, { withCredentials: true })
        .then(() => resolve())
        .catch(err => reject(err.response.data.error));
    })
  }
}

export default hikes
