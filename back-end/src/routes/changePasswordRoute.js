import { getDbConnection } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { awsUserPool } from '../util/awsUserPool';

export const changePasswordRoute = {
    path: '/api/change-password',
    method: 'post',
    handler: async (req, res) => {
        const { authorization } = req.headers;
        const { email, oldPassword, newPassword } = req.body;
        const cognitoUser = new CognitoUser({ Username: email, Pool: awsUserPool });

        if (!authorization) {
            return res.status(401).json({ message: 'No authorization header sent' });
        }

        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                console.error('Error verifying token:', err);
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            cognitoUser.authenticateUser(new AuthenticationDetails({
                Username: email,
                Password: oldPassword
            }), {
                onSuccess: (result) => {
                    cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
                        if (err) {
                            console.error('Error changing password:', err);
                            return res.status(500).json({ message: 'Error changing password' });
                        }

                        res.status(200).json({ message: 'Password changed successfully' });
                    });
                },
                onFailure: (err) => {
                    console.error('Error authenticating user:', err);
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
            });
        });
    }
}