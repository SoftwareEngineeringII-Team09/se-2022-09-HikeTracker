import axios from "axios";
import { SERVER_URL } from "./config";

exports.login = (loginData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}/login`, loginData)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    })
}

exports.signup = (signupData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${SERVER_URL}/signup`, signupData)
            .then(res => resolve(res.data))
            .catch(err => reject(err))
    })
}