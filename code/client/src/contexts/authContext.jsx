import { useState, useEffect, createContext } from 'react';
import { Spinner } from 'react-bootstrap';
import api from '../services/api';
import React from 'react';

const AuthContext = createContext([{}, () => { }]);

const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        api.getUserInfo()
            .then((data) => {
                setUser(data);
                setLoggedIn(true);
            })
            .catch((error) => {
                setLoggedIn(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dirty]);

    if (loading) {
        return <Spinner />;
    }
    else {
        return (
            <AuthContext.Provider value={[{ ...user, loggedIn }, setLoggedIn]}>
                {children}
            </AuthContext.Provider>
        )
    }
}

export { AuthContext, AuthProvider };