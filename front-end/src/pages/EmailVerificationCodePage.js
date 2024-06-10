import { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { EmailVerificationFail } from './EmailVerificationFail';
import { EmailVerificationSuccess } from './EmailVerificationSuccess';
import { useToken } from '../auth/useToken';
import { useQueryParams } from '../util/useQueryParams';

export const EmailVerificationCodePage = () => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFail, setIsFail] = useState(false);

    const [verificationString, setVerificationString] = useState('');
    const { email } = useQueryParams();
    const [, setToken] = useToken();

    //const history = useHistory();

    if (isSuccess) {
        return <EmailVerificationSuccess />;
    }
    
    if (isFail) {
        return <EmailVerificationFail />;
    }

    const onSubmitVerificationString = async () => {
        try {
            const response = await axios.put('/api/verify-email', {
                email,
                verificationString
            });
            const { token } = response.data;
            setToken(token);
            setIsSuccess(true);
        } catch (e) {
            console.log(e);
            setIsFail(true);
        }
    }
    return (
        <div className="content-container">
            <h1>Verify your email</h1>
            <label>
                Verification Code:
                <input
                    value={verificationString}
                    onChange={e => setVerificationString(e.target.value)}
                    type="text"
                    name="verificationString"
                    placeholder="Enter your verification code e.g. 123456"
                />
            </label>
            <button onClick={onSubmitVerificationString}>Verify</button>
        </div>
    );
}

