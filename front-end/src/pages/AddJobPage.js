import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import { Navbar } from '../navbar';
import axios from 'axios';


export const AddJobPage = () => {
    const user = useUser();
    const [token] = useToken();
    const { id } = user;
    const history = useHistory();

    const [jobTitle, setJobTitle] = useState('');
    const [jobTitleError, setJobTitleError] = useState(false);

    const [company, setCompany] = useState('');
    const [companyError, setCompanyError] = useState(false);

    const [notes, setNotes] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [applicationDate, setApplicationDate] = useState('');
    const [interviewDate, setInterviewDate] = useState('');

    const [status, setStatus] = useState('');
    const [statusError, setStatusError] = useState(false);

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    useEffect(() => {
        let timeoutId;
        if (showSuccessMessage || showErrorMessage) {
            timeoutId = setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(false);
            }, 3000);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [showSuccessMessage, showErrorMessage]);

    const saveChanges = async (event) => {
        event.preventDefault();
        try {
            if (jobTitle === '') {
                setJobTitleError(true);
            }
            if (company === '') {
                setCompanyError(true);
            }
            if (status === '') {
                setStatusError(true);
            }
            if (jobTitle === '' || company === '' || status === '') {
                return;
            }
            const response = await axios.post(`/api/add-job/${id}`, {
                jobTitle,
                company,
                notes,
                jobDescription,
                applicationDate,
                interviewDate,
                status,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setShowSuccessMessage(true);
                history.push('/job-searches');
            } else {
                setShowErrorMessage(true);
            }
        } catch (error) {
            console.error(error);
            setShowErrorMessage(true);
        }
    };


    const handleValidation = (setValue, setError) => (event) => {
        event.preventDefault();
        setValue(event.target.value);
        if (event.target.value !== '') {
            setError(false);
        }

    };

    return (
        <div className='addJobPage'>
            <Navbar />
            <section className='content inner'>
                <div className='formContainer'> 
                    <h1 className='contentTitle'>Add Job Page</h1>
                    {showSuccessMessage && <div className='success-message'>Job added successfully</div>}
                    {showErrorMessage && <div className='error-message'>Error occurred while adding job</div>}
                    <form className='addJobPageForm' onSubmit={saveChanges}>
                        <label>
                            Job Title:
                            <input
                                type='text'
                                value={jobTitle}
                                onChange={handleValidation(setJobTitle, setJobTitleError)}
                                className='inputField'
                            />
                            {jobTitleError && <div className='error'>Job title is required</div>}
                        </label>
                        <label>
                            Company:
                            <input
                                type='text'
                                value={company}
                                onChange={handleValidation(setCompany, setCompanyError)}
                                className='inputField'
                            />
                            {companyError && <div className='error'>Company is required</div>}
                        </label>
                        <label>
                            Notes:
                            <textarea
                                type='text'
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                className='inputField'
                            />
                        </label>
                        <label>
                            Job Description:
                            <input
                                type='text'
                                value={jobDescription}
                                onChange={(event) => setJobDescription(event.target.value)}
                                className='inputField'
                            />
                        </label>
                        <label>
                            Application Date:
                            <input
                                type='date'
                                value={applicationDate}
                                onChange={(event) => setApplicationDate(event.target.value)}
                                className='dateInput'
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </label>
                        <label>
                            Interview Date:
                            <input
                                type='date'
                                value={interviewDate}
                                onChange={(event) => setInterviewDate(event.target.value)}
                                className='dateInput'
                            />
                        </label>
                        <label>
                            Status:
                            <select 
                                value={status} 
                                onChange={handleValidation(setStatus, setStatusError)}
                                className='inputField'
                            >
                                <option value="" disabled>Select</option>
                                <option value="Successful">Successful</option>
                                <option value="Unsuccessful">Unsuccessful</option>
                                <option value="Applied">Applied</option>
                                <option value="Going for an interview">Going for an interview</option>
                                <option value="Cancelled and paused hiring">Cancelled and paused hiring</option>
                            </select>
                            {statusError && <div className='error'>Status is required</div>}
                        </label>
                        <button type='submit'>Add</button>
                    </form>
                </div>
            </section>
        </div>
    );

};