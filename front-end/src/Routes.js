import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { EmailVerificationCodePage } from './pages/EmailVerificationCodePage';
import { UserInfoPage } from './pages/UserInfoPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { PrivateRoute } from './auth/PrivateRoute';
import { PleaseVerifyEmailPage } from './pages/PleaseVerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { EmailVerificationLandingPage } from './pages/EmailVerificationLandingPage';
import { PasswordResetLandingPage } from './pages/PasswordResetLandingPage';
import { JobSearchesPage } from './pages/jobSearchesPages';
import { AddJobPage } from './pages/AddJobPage';
import { UpdateJobSearchPage } from './pages/UpdateJobSearchPage';
import { InterviewsPages } from './pages/InterviewsPages';
import { ChangeCurrentPasswordPage } from './pages/ChangeCurrentPassword';

export const Routes = () => {
    return (
        <Router>
            <Switch>
                <PrivateRoute path="/" exact>
                    <UserInfoPage />
                </PrivateRoute>
                <PrivateRoute path="/user-info" exact>
                    <UserInfoPage />
                </PrivateRoute>
                <PrivateRoute path="/job-searches" exact>
                    <JobSearchesPage />
                </PrivateRoute>
                <PrivateRoute path="/add-job" exact>
                    <AddJobPage />
                </PrivateRoute>
                <PrivateRoute path="/update-job/:userId/:jobId" exact>
                    <UpdateJobSearchPage />
                </PrivateRoute>
                <PrivateRoute path="/interviews" exact>
                    <InterviewsPages />
                </PrivateRoute>
                <PrivateRoute path="/change-password" exact>
                    <ChangeCurrentPasswordPage />
                </PrivateRoute>
                <Route path="/verify-email" exact>
                    <EmailVerificationCodePage />
                </Route>
                <Route path="/verify-email/:verificationString" exact>
                    <EmailVerificationLandingPage />
                </Route>
                <Route path="/forgot-password">
                    <ForgotPasswordPage />
                </Route>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <Route path="/reset-password">
                    <PasswordResetLandingPage />
                </Route>
                <Route path="/please-verify-email">
                    <PleaseVerifyEmailPage />
                </Route>
                <Route path="/signup">
                    <SignUpPage />
                </Route>
            </Switch>
        </Router>
    );
}