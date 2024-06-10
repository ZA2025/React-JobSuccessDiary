import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './auth/useUser';
import { useHistory } from 'react-router-dom';

export const Navbar = () => {
    const user = useUser();
    const history = useHistory();

    const [isOpen, setIsOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem('token');
        history.push('/login');
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (isOpen) {
            document.body.style.overflow = 'auto';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    return (
        <header className='pageHeader'>
            <nav className='pageHeaderNav inner'>
                 
                <ul className={`pageHeaderList ${isOpen ? 'open' : ''}`}>
                    <li className='pageHeaderButton'>
                        <Link to="/"><span>Home</span></Link>
                    </li>
                    {!user && (
                        <>
                            <li className='pageHeaderButton'>
                                <Link to="/login"><span>Login</span></Link>
                            </li>
                            <li className='pageHeaderButton'>
                                <Link to="/signup"><span>Sign Up</span></Link>
                            </li>
                        </>
                    )}
                    {user && (
                        <>
                            <li className='pageHeaderButton'>
                                <Link to="/user-info"><span>User Info</span></Link>
                            </li>
                            <li className='pageHeaderButton'>
                                <Link to="/job-searches"><span>Job Searches</span></Link>
                            </li>
                            <li className='pageHeaderButton'>
                                <Link to="/add-job"><span>Add Job</span></Link>
                            </li>
                            <li className='pageHeaderButton'>
                                <Link to="/interviews"><span>Interviews</span></Link>
                            </li>
                        </>
                    )}
                </ul>
                
                {user && (
                    <Link className='pageHeaderLogoutLink' to="/login" onClick={logout}><span>Logout</span></Link>
                )}
                <button onClick={toggleMenu} className="burger">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </header> 
    );
}