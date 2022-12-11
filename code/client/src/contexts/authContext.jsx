import { useState, useEffect, createContext } from 'react';
import { Spinner } from 'react-bootstrap';
import api from '../services/api';

const AuthContext = createContext([{}, () => { }]);

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({ role: "Visitor" });
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dirty, setDirty] = useState(true);

    useEffect(() => {
        if (dirty) {
            setLoading(true)
            api.users.getUserInfo()
                .then((data) => {
                    setUser(data);
                    setLoggedIn(true);
                })
                .catch(() => {
                    setUser(null);
                    setLoggedIn(false)
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