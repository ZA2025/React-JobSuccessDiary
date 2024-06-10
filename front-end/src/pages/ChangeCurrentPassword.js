import React, { useState } from "react";
import axios from "axios";
import { Navbar } from "../navbar";

export const ChangeCurrentPasswordPage = () => {
    // Update the current password
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const handleChangePassword = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/change-password', {
                email,
                oldPassword,
                newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                setShowSuccessMessage(true);
                setShowErrorMessage(false);
            } else {
                setShowErrorMessage(true);
                setShowSuccessMessage(false);
            }

        } catch (error) {
            console.log(error);
            setShowErrorMessage(true);
            setShowSuccessMessage(false);
        }
    };

    return (
        <div className="updatePasswordPage">
            <Navbar />
            <section className="inner">
                <div className="formContainer">
                    <form onSubmit={handleChangePassword}>
                        <h2>Change Password Page</h2>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                        <input
                            type='password'
                            placeholder='Old Password'
                            value={oldPassword}
                            onChange={(event) => setOldPassword(event.target.value)}
                            required
                        />
                        <input
                            type='password'
                            placeholder='New Password'
                            value={newPassword}
                            onChange={(event) => setNewPassword(event.target.value)}
                            required
                        />
                        <button type='submit'>Change Password</button>
                        {showSuccessMessage && <div className='success-message'>Password changed successfully</div>}
                        {showErrorMessage && <div className='error-message'>Error changing password</div>}
                    </form>
                </div>
            </section>
        </div>
    )
};
