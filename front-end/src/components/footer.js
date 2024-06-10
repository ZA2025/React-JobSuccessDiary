import React from 'react';
export const Footer = () => {
    const columns = [
        {
            lists: [
                {
                    title: 'Careers',
                    items: ['Job Listings', 'Internships', 'Career Advice', 'Career Development', 'Job Search Tips', 'Interview Tips', 'Resume Tips']
                }
            ]
        },
        {
            lists: [
                {
                    title: 'Technology',
                    items: ['Latest Tech', 'Reviews', 'Trends', 'Software']
                },
                {
                    title: 'Company',
                    items: ['About Us', 'Contact Us', 'Our Team', 'Our Mission']
                }
            ]
        },
        {
            lists: [
                {
                    title: 'Guidance',
                    items: ['Mentorship', 'Counseling', 'Workshops', 'Webinars', 'Tutorials', 'Courses', 'Articles']
                }
            ]
        },
    ];

    return (
        <footer className='pageFooter'>
            <div className='inner'>
                <div className='pageFooterRow'>
                {columns.map((column, index) => (
                    <div key={index} className='pageFooterCol'>
                        {column.lists.map((list, index) => (
                            <div key={index}>
                                <h2 className='pageFooterTitle'>{list.title}</h2>
                                <ul className='pageFooterList'>
                                    {list.items.map((item, index) => (
                                        <li key={index} className='pageFooterItem'>
                                            <a className='pageFooterLink' href="/">{item}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
                </div>
            </div>
        </footer>
    )
}