import { SERVER_URL } from "./config";

import axios from 'axios';

const users = {
    signup: (user) => {
        return new Promise((resolve, reject) => {
            axios.post(`${SERVER_URL}/auth/signup`, user)
                .then(res => {
                    resolve(res.data)
                })
                .catch(err => {
                    reject({
                        status: err.response.status,
                        statusText: err.response.statusText,
                        message: err.response.data.message
                    });
                })
        })
    },

    sendVerificationCode: (email) => {
        return new Promise((resolve, reject) => {
            axios.put(`${SERVER_URL}auth/send-verification-code`, email)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject({
                        status: err.response.status,
                        statusText: err.response.statusText,
                        message: err.response.data.message
                    });
                })
        })
    },

    verifyEmail: (data) => {
        return new Promise((resolve, reject) => {
            axios.put(`${SERVER_URL}/auth/verify-email`, data)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject({
                        status: err.response.status,
                        statusText: err.response.statusText,
                        message: err.response.data.message
                    });
                })
        })
    },

    login: (credentials) => {
        return new Promise((resolve, reject) => {
            axios.post('/auth/login', credentials)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject({
                        status: err.response.status,
                        statusText: err.response.statusText,
                        message: err.response.data.message
                    });
                })
        })
    },

    logout: () => {
        return new Promise((resolve, reject) => {
            axios.delete('/auth/logout')
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject({
                        status: err.response.status,
                        statusText: err.response.statusText,
                        message: err.response.data.message
                    })
                })
        })
    },

    getUserInfo: () => {
        return new Promise((resolve, reject) => {
            axios.get('/auth/current')
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject({
                        status: err.response.status,
                        statusText: err.response.statusText,
                        message: err.response.data.message
                    });
                })
        })
    }
}

export default users;
