import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import { Navbar } from '../navbar';
import axios from 'axios';

export const LoginPage = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [, setToken] = useToken();

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const onLoginClicked = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/api/login', { email, password });
            const { token } = response.data;
            setToken(token);
            setShowSuccessMessage(true);
            setShowErrorMessage(false);
            history.push('/');
        } catch (error) {
            console.log(error);
            setShowSuccessMessage(false);
            setShowErrorMessage(true);
        }
    }

    return (
        <div className="loginPage">
            <Navbar />
            <section className='content inner'>
                <div className='formContainer'>
                    <h1 className='contentTitle'>Login Page</h1>
                    {showSuccessMessage && <div className="success">Successfully logged in!</div>}
                    {showErrorMessage && <div className="fail">Uh oh... something went wrong and we couldn't log you in</div>}
                    <form className='form' onSubmit={onLoginClicked}>
                        <label>
                            Email:
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                type="text"
                                name="email"
                                placeholder="Enter your email"
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                            />
                        </label>
                        <hr />
                        <div className='buttonContainer'>
                            <button 
                                disabled={!email || !password}
                            type='submit'>Log In</button>
                            <button onClick={() => history.push('/forgot-password')}>Forgot password</button>
                            <button onClick={() => history.push('/signup')} >Sign Up?</button>
                        </div>
                    </form>
                </div>
                <div className='imageContainer'>
                    
                </div>
            </section>
        </div>
    );
}