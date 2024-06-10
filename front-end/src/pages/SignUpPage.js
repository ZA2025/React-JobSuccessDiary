import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import axios from 'axios';
import { Navbar } from '../navbar';
export const SignUpPage = () => {
     
    const [, setToken] = useToken();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const history = useHistory();

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const signUpClicked = async (event) => {
        event.preventDefault();
        
        try {
            const response = await axios.post('/api/signup', {
                email,
                password
            });
            const { token } = response.data;
            setToken(token);
            setShowSuccessMessage(true);
            setShowErrorMessage(false);
            setTimeout(() => {
                //history.push('/');
                history.push(`/verify-email?email=${encodeURIComponent(email)}`);
            }, 1000);
        } catch (e) {
            console.log(e);
            setShowSuccessMessage(false);
            setShowErrorMessage(true);
        }
    }

    return (
        <div className="signUpPage">
            <Navbar />
            <section className='content inner'>
                <div className='formContainer'>
                    <h1 className='contentTitle'>Sign up Page</h1>
                    {showSuccessMessage && <div className="success">Successfully logged in!</div>}
                    {showErrorMessage && <div className="fail">Uh oh... something went wrong and we couldn't log you in</div>}
                    <form className='form' onSubmit={signUpClicked}>
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
                                disabled={
                                    !email || !password
                                } 
                            >Sign up</button>
                            <button onClick={() => history.push('/login')} >Have an account? Login</button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}