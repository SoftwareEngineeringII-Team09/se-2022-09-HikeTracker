import { SERVER_URL } from "./config";
import axios from "axios";

export function login(loginData) {
    return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}/login`, loginData)
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
}

export function signup(signupData) {
    return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}/signup`, signupData)
            .then(res => resolve(res.data))
            .catch(err => reject(err));
    });
}