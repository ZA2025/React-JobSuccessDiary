import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Navbar } from '../navbar';

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const history = useHistory();

    const onSubmit = async () => {
        try {
            await axios.put('/api/forgot-password', {
                email
            });
            setShowSuccessMessage(true);
            setShowErrorMessage(false);
            setTimeout(() => {
                history.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }, 3000);
        } catch (e) {
            console.log(e);
            setShowSuccessMessage(false);
            setShowErrorMessage(true);
        }
    }

    return (
        <div className="forgotPassword">
            <Navbar />
            <section className="content inner">
                <h1 className="contentTitle">Forgot Password</h1>
                <div className="formContainer">
                {showSuccessMessage && <div className="success">Password reset email sent!</div>}
                {showErrorMessage && <div className="fail">Uh oh... something went wrong and we couldn't send the email</div>}
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
                <button onClick={onSubmit}>Submit</button>
                </div>
            </section>
        </div>
    );
};