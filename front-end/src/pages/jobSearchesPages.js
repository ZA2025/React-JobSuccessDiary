import { useState, useEffect } from 'react';
import  axios  from 'axios';
import { useToken } from '../auth/useToken';
import { useUser } from '../auth/useUser';
import { useHistory } from 'react-router-dom';

import { Navbar } from '../navbar';

export const JobSearchesPage = () => {
    const user = useUser(); 
    const [token] = useToken();
    const { id } = user;
    const history = useHistory();

    const [jobSearches, setJobSearches] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);

    // Add new state variables
    const [totalApplications, setTotalApplications] = useState(0);
    const [applicationsToday, setApplicationsToday] = useState(0);

    // search for Company
    const [searchCompany, setSearchCompany] = useState('');

    const filteredJobSearches = jobSearches.filter((jobSearch) => {
        return jobSearch.company.toLowerCase().includes(searchCompany.toLowerCase());
    });

    // Adding pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    // Calculate the items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredJobSearches.slice(indexOfFirstItem, indexOfLastItem);
    // Calculate the page numbers
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

    function handleUpdate(jobId) {
        history.push(`/update-job/${id}/${jobId}`);
    }
    
    async function handleDelete(jobId) {
        // Code to delete the job with the given ID
        try {
            const response = await axios.delete(`/api/delete-job/${id}/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowSuccessMessage(true);
            if (response.status === 200) {
                setShowSuccessMessage(true);
                setJobSearches(jobSearches.filter((jobSearch) => jobSearch.id !== jobId));
            } else {
                setShowErrorMessage(true);
            }
    
        } catch (error) {
            console.error(error);
            setShowErrorMessage(true);
        }
    }
    useEffect(() => {
        // eslint-disable-next-line no-unused-vars
        let isMounted = true;
        const fetchJobSearches = async () => {
            try {
                const response = await axios.get(`/api/job-searches/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                if (isMounted) {
                    if (Array.isArray(response.data)) {
                        const sortedJobSearches = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                         
                        setJobSearches(sortedJobSearches);
                        setTotalApplications(sortedJobSearches.length);
                        const today = new Date();
                        const formattedDate = today.toISOString().split('T')[0];
                        const applicationsToday = sortedJobSearches.filter((jobSearch) => jobSearch.applicationDate === formattedDate).length;
                        setApplicationsToday(applicationsToday);
                    }
                     
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchJobSearches();
        return () => {
            // Cleanup function to cancel any pending requests
            isMounted = false;
        };
    }, [id, token]);
    const calculateDaysAgo = (date) => {
        return Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    }

    return (
        <div className='jobSearchesPage'>
            <Navbar />
            <section className='content inner'>
                <h1 className='contentTitle'>Job Applications</h1>
                <div className='searchContainer'>
                    <label htmlFor='searchCompany'>Search by company:</label>
                    <input
                        id='searchCompany'
                        type='text'
                        placeholder='Search by company'
                        value={searchCompany}
                        onChange={(event) => setSearchCompany(event.target.value)}
                        className='searchInput'    
                    />  
                </div>
                {showSuccessMessage && <div className='success-message'>Job deleted successfully</div>}
                {showErrorMessage && <div className='error-message'>Error occurred while deleting job</div>}
                <p className=''>Applications made today: {applicationsToday}. Total applications: {totalApplications}</p>
                <div>
                    {currentItems.map((jobSearch, index) => (
                        <div key={index} className='jobSearchesPageCard'>
                            <p><span className="jobSearchesPageItem">Job Title:</span> {jobSearch.jobTitle}</p>
                            <p><span className="jobSearchesPageItem">Company:</span> {jobSearch.company}</p>
                            <p><span className="jobSearchesPageItem">Notes:</span> {jobSearch.notes}</p>
                            <p><span className="jobSearchesPageItem">Job Description:</span> {jobSearch.jobDescription}</p>
                            <p><span className="jobSearchesPageItem">Application Date:</span> 
                                <span> {jobSearch.applicationDate || new Date().toISOString().split('T')[0]} </span> 
                                <span className='highlighted'> You have applied {calculateDaysAgo(jobSearch.applicationDate || new Date())} days ago</span>   
                            </p>
                            <p>
                                <span className="jobSearchesPageItem status">Status:</span>
                                <span className={jobSearch.status === 'Unsuccessful' ? 'unsuccessful' : '' || jobSearch.status === 'Cancelled and paused hiring' ? 'cancelled' : ''}>{jobSearch.status}</span>
                            </p>
                            <div className="buttonContainer">
                                <button onClick={() => handleUpdate(jobSearch.id)}>Update</button>
                                <button onClick={() => handleDelete(jobSearch.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='pagination'>
                    <ul className='pageNumbers'>
                        {pageNumbers.map(number => (
                            <li key={number} className={number === currentPage ? 'active' : ''}>
                                <button className='paginationLink' onClick={() => setCurrentPage(number)}>{number}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </section> 
        </div>
    );
};