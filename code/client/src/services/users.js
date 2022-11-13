import { SERVER_URL } from "./config";
import axios from "axios";

export function login(loginData) {
    return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}/auth/login`, loginData)
            .then(res => resolve(res.data))
            .catch(err => {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message
                });
            })
    });
}

export function signup(signupData) {
    return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}/auth/signup`, signupData)
            .then(res => resolve(res.data))
            .catch(err => {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message
                });
            })
    });
}

export function verifyEmail(data) {
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
            });
    });
}

export function sendVerificationCode(email) {
    return new Promise((resolve, reject) => {
        axios.put(`${SERVER_URL}/auth/send-verification-code`, email)
            .then(() => {
                resolve();
            })
            .catch(err => {
                reject({
                    status: err.response.status,
                    statusText: err.response.statusText,
                    message: err.response.data.message
                });
            });
    });
}

export function getUserInfo() {
    return new Promise((resolve, reject) => {
        axios.get(`${SERVER_URL}/auth/current`)
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