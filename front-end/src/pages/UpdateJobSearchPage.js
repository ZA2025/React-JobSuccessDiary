import React from "react";
import { useState, useEffect } from "react";
//import { useHistory } from "react-router-dom";
import { useToken } from "../auth/useToken";
//import { useUser } from "../auth/useUser";
import { Navbar } from "../navbar";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { Link } from 'react-router-dom';

export const UpdateJobSearchPage = () => {
    const { userId, jobId } = useParams();
    //const user = useUser(); 
    const [token] = useToken();
    const [job, setJob] = useState({
        jobTitle: '',
        company: '',
        notes: '',
        jobDescription: '',
        applicationDate: '',
        interviewDate: '',
        status: '',
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    //const history = useHistory();

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

    useEffect(() => {
        // Fetch the job data when the component mounts
        axios.get(`/api/job/${userId}/${jobId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        
        })
            .then(response => setJob(response.data))
            .catch(error => console.error(error));
    }, [userId, jobId, token]);

    const handleChange = (event) => {
        setJob({
            ...job,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.put(`/api/update-job/${userId}/${jobId}`, job, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        
        })
            .then(response => {
                if (response.status === 200) {
                    setShowSuccessMessage(true);
                    //history.push('/job-searches');
                } else {
                    setShowErrorMessage(true);
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="updateJobPage">
            <Navbar />
            <section className="content inner">
                <h1 className="contentTitle">Update Job Seacrh</h1> 
                <div className='formContainer'>
                    {showSuccessMessage && <div className='success-message'>Job updated successfully</div>}
                    {showErrorMessage && <div className='error-message'>Error updating job</div>}
                    <form className="form" onSubmit={handleSubmit}>
                        <label>
                            Job Title:
                            <input type="text" name="jobTitle" value={job.jobTitle} onChange={handleChange} />
                        </label>
                        <label>
                            Company:
                            <input type="text" name="company" value={job.company} onChange={handleChange} />
                        </label>
                        <label>
                            Notes:
                            <textarea type="text" name="notes" value={job.notes} onChange={handleChange} />
                        </label>
                        <label>
                            Job Description:
                            <input type="text" name="jobDescription" value={job.jobDescription} onChange={handleChange} />
                        </label>
                        <label>
                            Application Date:
                            <input 
                                type="date" 
                                name="applicationDate" 
                                value={job.applicationDate} 
                                onChange={handleChange} 
                                className='dateInput'
                                max={new Date().toISOString().split('T')[0]} 
                            />
                        </label>
                        <label>
                            Interview Date:
                            <input 
                                type="date" 
                                name="interviewDate" 
                                value={job.interviewDate} 
                                onChange={handleChange} 
                                className='dateInput'
                            />
                        </label>
                        <label>
                            Status:
                            <select name="status" value={job.status} onChange={handleChange}>
                                    <option value="" disabled>Select</option>
                                    <option value="Successful">Successful</option>
                                    <option value="Unsuccessful">Unsuccessful</option>
                                    <option value="Applied">Applied</option>
                                    <option value="Going for an interview">Going for an interview</option>
                                    <option value="Cancelled and paused hiring">Cancelled and paused hiring</option>
                                </select>
                            
                        </label>
                        <button type="submit">Update Job</button>
                        <Link className="back" to="/job-searches">Back</Link>
                        
                    </form>
                </div>
            </section>
        </div>
    )
};