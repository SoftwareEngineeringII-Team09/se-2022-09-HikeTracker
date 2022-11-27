import { SERVER_URL } from "./config";

import axios from 'axios';

const users = {
    signup: (user) => {
        return new Promise((resolve, reject) => {
            axios.post(`${SERVER_URL}/auth/signup`, user)
                .then(() => resolve())
                .catch(err => reject(err.response.data.error));
        });
    },

    login: (credentials) => {
        return new Promise(async (resolve, reject) => {
            axios.post(`${SERVER_URL}/auth/login/password`, credentials, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response.data.error));
        });
    },

    sendVerificationCode: (email) => {
        return new Promise(async (resolve, reject) => {
            axios.put(`${SERVER_URL}/auth/send-verification-code`, email)
                .then(() => resolve())
                .catch(err => reject(err.response.data.error));
        });
    },

    verifyEmail: (data) => {
        return new Promise((resolve, reject) => {
            axios.put(`${SERVER_URL}/auth/verify-email`, data)

                .then(() => resolve())
                .catch(err => reject(err.response.data.error));
        });
    },

    logout: () => {
        return new Promise(async (resolve, reject) => {
            axios.delete(`${SERVER_URL}/auth/logout`, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response.data.error));
        });
    },

    getUserInfo: () => {
        return new Promise(async (resolve, reject) => {
            axios.get(`${SERVER_URL}/auth/current`, { withCredentials: true })
                .then(res => resolve(res.data))
                .catch(err => reject(err.response.data.error));
        });
    }
}

export default users;
