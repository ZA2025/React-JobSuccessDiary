import { signUpRoute } from './signUpRoute';
import { testRoute } from './testRoute';
import { loginRoute } from './loginRoute';
//import { updateUserInfoRoute } from './updateUserInfoRoute';
import { verifyEmailRoute } from './verifyEmailRoute';
import { forgotPasswordRoute } from './forgotPasswordRoute';
import { resetPasswordRoute } from './resetPasswordRoute';
import { jobSearchesRoute } from './jobSearchesRoute';
import { addJobRoute } from './addJobRoute';
import { deleteJobRoute } from './deleteJobRoute';
import { updateJobRoute } from './updateJobRoute';
import { getJobSearchRoute } from './getJobSearchRoute';
import { changePasswordRoute } from './changePasswordRoute';
import { getUserInfoRoute } from './getUserInfoRoute';
import { updateUserInfoRoute } from './updateUserInfoRoute';

export const routes = [
    testRoute,
    signUpRoute,
    loginRoute,
    updateUserInfoRoute,
    verifyEmailRoute,
    forgotPasswordRoute,
    resetPasswordRoute, 
    jobSearchesRoute,
    addJobRoute,
    deleteJobRoute,
    updateJobRoute,
    getJobSearchRoute,
    changePasswordRoute,
    getUserInfoRoute,
];
