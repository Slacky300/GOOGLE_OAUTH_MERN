import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';
import { getLocalStorageWithExpiry, login } from '../helpers/auth/authFn';
import { useUpdate } from '../context/hasUpdated';



const Login = () => {


    const token = getLocalStorageWithExpiry('auth')?.token;

    const logInWithGoogle = () => {
        window.open(`${import.meta.env.VITE_APP_BACKEND_URL}/users/auth/google`, '_self');
        
    }

    const navigate = useNavigate();
    const {auth,setAuth} = useAuth();
    const {loading, setLoading} = useUpdate();
    const [userCreds, setUser] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        if(token){
            navigate('/');
        }
    },[]);

    const handleChange = (e) => {
        setUser((prevUser) => ({
            ...prevUser,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(userCreds).finally(() => setLoading(false));
        const { message, user, token, status } = result;

        if(status === 200){
            setAuth({
                ...auth,
                user,
                token
            })
            toast(message, {type: 'success'});
            navigate('/home');
            return;
        }

        toast(message, {type: 'error'});
    };

    return (
        <>
            <div className="container my-5" style={{ maxWidth: '50em' }}>
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-6 d-flex justify-content-center align-items-center">
                        <h1 className='display-3'> LOGIN</h1>
                    </div>
                </div>
                <div className="row my-5 d-flex justify-content-center align-items-center">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit} className='form-control'>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={userCreds.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={userCreds.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="my-3 d-flex justify-content-end">
                                <button disabled={loading} type="submit" className="btn btn-primary">
                                    {loading ? 'Logging In...' : 'Login'}
                                </button>
                            </div>
                        </form>
                        <hr />
                        <p className="my-3 text-center">
                           <button onClick={()=> logInWithGoogle()} className="btn btn-dark my-2">Login with Google <i class="bi bi-google"></i></button>
                        </p>
                        <p className="my-3 text-center">
                            Don't have an account?{' '}
                            <Link to="/register">Register here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;