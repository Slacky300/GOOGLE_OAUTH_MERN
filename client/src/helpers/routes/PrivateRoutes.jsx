import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { getLocalStorageWithExpiry } from '../auth/authFn';

const PrivateRoutes = () => {
    const token = getLocalStorageWithExpiry('auth').token;
    const {auth} = useAuth();



    return (
        <>
            {token || auth?.token ? <Outlet /> : <Navigate to="/login" />}
        </>
    );
};

export default PrivateRoutes;