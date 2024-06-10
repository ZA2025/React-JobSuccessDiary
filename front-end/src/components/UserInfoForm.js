import React from 'react';

export const UserInfoForm = ({ name, setName, job, setJob, saveChanges, resetValues, logOut, changePassword }) => {
    // change password should redirect to change password page

    return (
        <form className='form' onSubmit={saveChanges}>
            <label>
                Name:
                <input
                    onChange={e => setName(e.target.value)}
                    value={name} />
            </label>
            <label>
                Job:
                <input
                    onChange={e => setJob(e.target.value)}
                    value={job} />
            </label>
            
            <hr />
            <div className='buttonContainer'>
                <button type='submit'>Save Changes</button>
                {/*<button onClick={resetValues}>Reset Values</button>*/}
                {/*<button onClick={logOut}>Log Out</button>*/}
                <button onClick={changePassword}>Change Password</button>
            </div>
        </form>
    );
}
