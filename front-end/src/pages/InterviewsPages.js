import { useState, useEffect } from 'react';
import  axios  from 'axios';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import { useHistory } from 'react-router-dom';
import { Navbar } from '../navbar';

export const InterviewsPages = () => {

    const user = useUser();
    const [token] = useToken();
    const { id } = user;
    const history = useHistory();
    const [jobSearches, setJobSearches] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    const [searchCompany] = useState('');

    const filteredJobSearches = jobSearches.filter((jobSearch) => {
        return jobSearch.company.toLowerCase().includes(searchCompany.toLowerCase());
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredJobSearches.slice(indexOfFirstItem, indexOfLastItem);
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(filteredJobSearches.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
        if (showSuccessMessage || showErrorMessage) {
            setTimeout(() => {
                setShowSuccessMessage(false);
                setShowErrorMessage(false);
            }, 3000);
        }
    }, [showSuccessMessage, showErrorMessage]);

    // fetch the jobsearches 
    useEffect(() => {
        async function fetchJobSearches() {
            try {
                const response = await axios.get(`/api/job-searches/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const result = response.data;
                // display only the jobs that have a status of 'Going for an interview'
                response.data = result.filter((jobSearch) => jobSearch.status === 'Going for an interview');
                console.log(response.data)
                setJobSearches(response.data || []);
                 
            } catch (error) {
                console.error(error);
            }
        }
        fetchJobSearches();
    }, [id, token, showSuccessMessage, showErrorMessage]);

    function handleUpdate(jobId) {
        history.push(`/update-job/${id}/${jobId}`);
    }
    
    return (
        <div className="InterviewPage">
            <Navbar />
            <section className='content inner'>
                <h1 className='contentTitle'>Job Searches</h1>
                
                <div className='interviews'>
                    {currentItems.map((jobSearch) => {
                        return (
                            <div key={jobSearch.id} className='interviewCard'>
                                <div className='interviewInfo'>
                                    <h2 className='interviewTitle'>{jobSearch.jobTitle}</h2>
                                    <p className='interviewCompnay'>{jobSearch.company}</p>
                                    <p className='interviewNotes'>{jobSearch.notes}</p> 
                                    <p className='interviewStatus'>{jobSearch.status}</p>
                                    <p className='interviewDescription'>{jobSearch.jobDescription}</p>
                                     
                                </div>
                                <div className='interviewButtonContainer'>
                                    <span className='interviewDate'> {jobSearch.interviewDate}</span> 
                                    <button className='interviewUpdateBtn' onClick={() => handleUpdate(jobSearch.id)}>Update</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className='pagination'>
                    {pageNumbers.map((number) => {
                        return (
                            <button
                                key={number}
                                onClick={() => setCurrentPage(number)}
                            >
                                {number}
                            </button>
                        );
                    })}
                </div>
                
                {showSuccessMessage && <p className='successMessage'>Success!</p>}
                {showErrorMessage && <p className='errorMessage'>Error!</p>}
            </section>
        </div>
    );
    
};