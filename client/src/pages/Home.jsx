import React from 'react'
import { useAuth } from '../context/authContext'

const Home = () => {
    const {auth} = useAuth();
    return (
        <div className='container my-5'>
            <div className='row d-flex justify-content-center align-items-center'>
                <div className='col-md-6 py-4 px-4'>
                    <img src={auth?.user?.profilePicture} alt='profile-photo' className='img-fluid w-50' />
                </div>
                <div className='col-md-6'>
                    <h2 className='lead display-3'>Welcome {auth?.user?.username}</h2>
                    <h3 className='lead'>Your email is {auth?.user?.email}</h3>
                </div>
            </div>
        </div>
    )
}

export default Home