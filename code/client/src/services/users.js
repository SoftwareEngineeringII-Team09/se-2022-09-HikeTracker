import { SERVER_URL } from "./config";

import axios from 'axios';

const users = {

    signup: (user) => {
        return new Promise(async (resolve, reject) => {
            axios.post(`${SERVER_URL}/auth/signup`, user)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    },

    login: (credentials) => {
        return new Promise(async (resolve, reject) => {
            axios.post(`${SERVER_URL}/auth/login`, credentials)
                .then(res => resolve(res.data))
                .catch(err => reject(err));
        });
    },

    sendVerificationCode: (email) => {
        return new Promise(async (resolve, reject) => {
            axios.put(`${SERVER_URL}/auth/send-verification-code`, email)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    },

    verifyEmail: (data) => {
        return new Promise(async (resolve, reject) => {
            axios.put(`${SERVER_URL}/auth/verify-email`, data)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    },

    logout: () => {
        return new Promise(async (resolve, reject) => {
            axios.delete(`${SERVER_URL}/auth/logout`)
                .then(res => resolve(res.data))
                .catch(err => reject(err));
        });
    },

    getUserInfo: () => {
        return new Promise(async (resolve, reject) => {
            axios.get(`${SERVER_URL}/auth/current`)
                .then(res => resolve(res.data))
                .catch(err => reject(err));
        });
    }
};

export default users;
