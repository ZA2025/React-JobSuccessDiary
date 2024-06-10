import { getDbConnection } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pako from 'pako';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { awsUserPool } from '../util/awsUserPool';

export const loginRoute = {
    path: '/api/login',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;
        const db = getDbConnection('react-user-authentication-db');
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const passwordValid = bcrypt.compareSync(password, user.passwordHash);

        if (!passwordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const payload = {
            userId: user._id,
            email,
            info: user.info,
            isVerified: user.isVerified,
        };

        const compressedPayload = pako.deflate(JSON.stringify(payload), { to: 'string' });

        const token = jwt.sign(
            { data: compressedPayload }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2d' }, 
            (err, token) => {
                if (err) {
                    console.error('Error creating token', err);
                    return res.status(500).send('Error creating token');
                }
                res.status(200).json({ token });
            }
        );
    }
}