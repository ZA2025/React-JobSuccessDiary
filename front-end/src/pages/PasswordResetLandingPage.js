import { useState } from 'react';
import axios from 'axios';
import { PasswordResetSuccess } from './PasswordResetSuccess';
import { PasswordResetFail } from './PasswordResetFail';
import { useQueryParams } from '../util/useQueryParams';
import { Navbar } from '../navbar';

export const PasswordResetLandingPage = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailure, setIsFailure] = useState(false);
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [passwordResetCode, setPasswordResetCode] = useState('');
    const { email } = useQueryParams();

    const onResetClicked = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`/api/users/${passwordResetCode}/reset-password`, { email, newPassword: passwordValue });
            setIsSuccess(true);
        } catch (e) {
            setIsFailure(true);
        }
    }

    if (isFailure) return <PasswordResetFail />
    if (isSuccess) return <PasswordResetSuccess />

    return (
        <div className="pwResetPage">
            <Navbar />  
            <section className='pwResetPageContent'>
                <div className='formContainer'>
                    <h1 className='pwResetPageTitle'>Reset Password</h1>
                    <p className='pwResetPageText'>Please enter a new password</p>
                    <form className='form' onSubmit={onResetClicked}>
                        <input
                            value={passwordResetCode}
                            onChange={e => setPasswordResetCode(e.target.value)}
                            placeholder="Password Reset Code" />
                        <input
                            type='password'
                            value={passwordValue}
                            onChange={e => setPasswordValue(e.target.value)}
                            placeholder="Password" />
                        <input
                            type='password'
                            value={confirmPasswordValue}
                            onChange={e => setConfirmPasswordValue(e.target.value)}
                            placeholder="Confirm Password" />
                        <button
                            disabled={!passwordValue || !confirmPasswordValue || passwordValue !== confirmPasswordValue}
                        >Reset Password</button>
                    </form>
                </div>
            </section>
        </div>
    )
}