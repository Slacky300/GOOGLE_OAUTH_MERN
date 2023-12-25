import React, { useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { setLocalStorageWithExpiry } from '../helpers/auth/authFn'
import { toast } from 'react-toastify'

const GoogleAuth = () => {
    const { auth, setAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { tokenP } = useParams()

    useEffect(() => {
        const getCredentials = async () => {
            try {
                setLoading(true)
                const res = await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/users/get-user-detail`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${tokenP}`,
                        
                      },
                   
                });

                const data = await res.json();
                setLocalStorageWithExpiry('auth', data, 60);

                const {user, token} = data;


                if (res.status === 200) {
                    setAuth({
                        ...auth,
                        user,
                        token
                    });

                    

                    navigate('/home')
                }else{
                    toast.error(data.message)
                    navigate('/');
                }
            } catch (err) {
                alert(err)
            } finally {
                setLoading(false)
            }
        }
        getCredentials()
    }, [])
    return (
        <div className='container my-5'>
            {loading ? (
                <h2>Fetching your data please wait......</h2>
            ) : (<>
                <h3>Failed to sign in with google</h3>
                <button className='btn btn-primary' onClick={() => navigate('/')}>Back to login</button>
            </>)}
        </div>
    )
}

export default GoogleAuth