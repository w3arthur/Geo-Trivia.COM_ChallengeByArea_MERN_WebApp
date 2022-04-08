import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../context/AuthProvider";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation(); //this location before redirection

    return (<>
        {auth?.roles?.find(role => allowedRoles?.includes(role)) ? <Outlet />  //Continue to this router
            : auth?.email ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/login" state={{ from: location }} replace />}
            
        {console.log(':: Require Rule Page')}
        {console.log('allowedRoles ',allowedRoles, 'auth ', auth)}
    </>);
}
export default RequireAuth;