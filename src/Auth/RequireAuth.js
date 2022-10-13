import { useLocation, Navigate, Outlet } from "react-router-dom";
import  { useAuth } from "../Context";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation(); //this location before redirection

    return (<>
        {auth?.role?.find(role => allowedRoles?.includes(role)) ? <Outlet />  //Continue to this router
            : auth?._id ? <Navigate to="/unauthorized" state={{ from: location }} replace />
            : <Navigate to="/login" state={{ from: location }} replace />}
    </>);
}
export default RequireAuth;