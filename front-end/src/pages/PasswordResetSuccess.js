import { useHistory } from 'react-router-dom';
import { Navbar } from '../navbar';
export const PasswordResetSuccess = () => {
    const history = useHistory();

    return (
        <div className="pwResetSuccess">
            <Navbar />
            <div className='pwResetSuccessContent'>
                <h1 className='pwResetSuccessTitle'>Success!</h1>
                <p className='pwResetSuccessText'>
                    Your password has been reset, now please login with your new password.
                </p>
                <button onClick={() => history.push('/login')}>Log in</button>
            </div>
            
        </div>
    );
}