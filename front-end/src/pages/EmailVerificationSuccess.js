import { useHistory } from 'react-router-dom';
export const EmailVerificationSuccess = () => { 
    const history = useHistory();
    return (
        <div className="successPage">
            <section className='successPageContent inner'>
                <h1>Success!</h1>
                <p>Your email has been verified.</p>
                <button onClick={() => history.push('/login')}>Go to login</button>
            </section>
        </div>
    );
}