import { useState, useEffect, createContext } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify'
import api from '../services/api';
import React from 'react';

const AuthContext = createContext([{}, () => { }]);

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({ role: "Visitor" });
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dirty, setDirty] = useState(true);

    useEffect(() => {
        if (dirty) {
            api.users.getUserInfo()
                .then((data) => {
                    setUser(data);
                    setLoggedIn(true);
                })
                .catch((err) => {
                    setUser(null);
                    setLoggedIn(false);
                    toast.error(err.message, { theme: 'colored' })
                })
                .finally(() => {
                    setDirty(false);
                    setLoading(false);
                });
        }
    }, [dirty]);

    if (loading) return (
        <div role="status" className='h-100vh position-absolute top-50 start-50' >
            <Spinner animation="border" variant="primary-dark" />
        </div>
    )
    else return (
        <AuthContext.Provider value={[{ ...user, loggedIn }, setDirty]}>
            {children}
        </AuthContext.Provider>
    )

}

export { AuthContext, AuthProvider };