import { SERVER_URL } from "./config";
import axios from 'axios';

const selectedHikes = {
  terminateHike: (selectedHikeId, time) => {
    return new Promise((resolve, reject) => {
      axios.put(`${SERVER_URL}/selectedHikes/${selectedHikeId}/terminate`, { time }, { withCredentials: true })
        .then(() => resolve())
        .catch(err => reject(err.response.data.error));
    });
  }
};

export default selectedHikes;