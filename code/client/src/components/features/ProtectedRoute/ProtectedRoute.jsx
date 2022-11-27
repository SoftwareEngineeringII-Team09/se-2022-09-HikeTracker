import { AuthContext } from '../../../contexts/authContext';
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from 'react';

const ProtectedRoute = ({
    requiresLogin = false,
    requiresNoLogin = false,
    requiredRole = null,
    redirectPath = '/'
}) => {

    /* Get user info from context */
    const [userStatus,] = useContext(AuthContext);

    console.log(userStatus);

    /* Redirect unauthorized users to redirectPath */
    const userRole = userStatus.role || "";
    const unauthenticated = requiresLogin && !userStatus.loggedIn;
    const notUnauthenticated = requiresNoLogin && userStatus.loggedIn;
    const unauthorized = requiredRole && userRole !== requiredRole;
    if (unauthenticated || unauthorized || notUnauthenticated)
        return <Navigate to={redirectPath} replace />;

    return <Outlet />;
};

export default ProtectedRoute;