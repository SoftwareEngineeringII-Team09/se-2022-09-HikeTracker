import { SERVER_URL } from "./config";

import axios from 'axios';

const users = {

    signup: (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.post(`${SERVER_URL}/auth/signup`, user);
                resolve();
            } catch (err) {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message || err.response.statusText
                });
            }
        });
    },

    login: (credentials) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await axios.post(`${SERVER_URL}/auth/login`, credentials);
                resolve(data);
            } catch (err) {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message || err.response.statusText
                });
            }
        });
    },

    sendVerificationCode: (email) => {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.put(`${SERVER_URL}/auth/send-verification-code`, {email});
                resolve();
            } catch (err) {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message || err.response.statusText
                });
            }
        });
    },

    verifyEmail: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                await axios.put(`${SERVER_URL}/auth/verify-email`, data);
                resolve();
            } catch (err) {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message || err.response.statusText
                });
            }
        });
    },

    logout: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.delete(`${SERVER_URL}/auth/logout`);
                resolve(res.data);
            } catch (err) {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message || err.response.statusText
                });
            }
        });
    },

    getUserInfo: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${SERVER_URL}/auth/current`);
                resolve(res.data);
            } catch (err) {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message || err.response.statusText
                });
            }
        });
    }
};

export default users;
