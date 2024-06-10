import { useState, useEffect, useCallback } from 'react';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import { Navbar } from '../navbar';
import  axios  from 'axios';

export const UserInfoPage = () => {
    const user = useUser();
    const [token] = useToken();
    const { id } = user;

    // i need to fetch this api /api/users/:userId to get the users info object get all the info from the user object
    const [email, setEmail] = useState('');
    const [userInfo, setUserInfo] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        if (showSuccessMessage || showErrorMessage) {
            setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(false);
            }, 3000);
        }
    }, [showSuccessMessage, showErrorMessage]);

    const getUserInfo = useCallback(async () => {
        try {
            const response = await axios.get(`/api/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
             
            let user = response.data;
            console.log(user);
            setEmail(user.email);
            setUserInfo(response.data.info);
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                window.location = '/login';
            }
        }
    }, [id, token])

    const handleChange = (event) => {
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`/api/update-user-info/${id}`, {
            name: userInfo.name,
            job: userInfo.job
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response.data);
                setShowSuccessMessage(true);
            })
            .catch(error => {
                console.error(error);
                setShowErrorMessage(true);
            });
    };

    useEffect(() => {
        getUserInfo();
    }, [getUserInfo]);

   
    return (
        <div className='userInfoPage'>
            <Navbar />
            <section className='content inner'>
                <div className='formContainer'>
                    <h1 className='contentTitle'>Welcome to Job Search</h1>
                    {showSuccessMessage && <div className='success-message'>Success!</div>}
                    {showErrorMessage && <div className='error-message'>Error!</div>}
                    <h3>{email}</h3>
                    <form className="form" onSubmit={handleSubmit}>
                        <label>
                            Name:
                            <input
                                name='name'
                                type='text'
                                value={userInfo?.name || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Role:
                            <input
                                name='job'
                                type='text'
                                value={userInfo?.job || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <button type='submit'>Save</button>
                    </form>
                </div> 
            </section>
        </div>
    );

}