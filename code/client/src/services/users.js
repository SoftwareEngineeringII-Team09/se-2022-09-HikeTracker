import { SERVER_URL } from "./config";

import axios from 'axios';

const users = {

    signup: (user) => {
        return new Promise((resolve, reject) => {
            axios.post(`${SERVER_URL}/auth/signup`, user)
                .then((res) => resolve(res.data))
                .catch(err => reject(err.response ? err.response.data.error : err.message));
        });
    },

    login: (credentials) => {
        return new Promise((resolve, reject) => {
            axios.post(`${SERVER_URL}/auth/login/password`, credentials, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response ? err.response.data.error : err.message));
        });
    },

    sendVerificationCode: (userId) => {
        return new Promise((resolve, reject) => {
            axios.put(`${SERVER_URL}/auth/sendVerificationCode`, { userId })
                .then(() => resolve())
                .catch(err => reject(err.response ? err.response.data.error : err.message));
        });
    },

    verifyEmail: (data) => {
        return new Promise((resolve, reject) => {
            axios.put(`${SERVER_URL}/auth/verifyEmail`, data)
                .then(() => resolve())
                .catch(err => reject(err.response ? err.response.data.error : err.message));
        });
    },

    logout: () => {
        return new Promise((resolve, reject) => {
            axios.delete(`${SERVER_URL}/auth/logout`, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response ? err.response.data.error : err.message));
        });
    },

    getUserInfo: () => {
        return new Promise((resolve, reject) => {
            axios.get(`${SERVER_URL}/auth/current`, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response ? err.response.data.error : err.message));

        });
    }
};

export default users;
