import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { getDbConnection } from '../db';


export const getUserInfoRoute = {
    path: '/api/users/:userId',
    method: 'get',
    handler: async (req, res) => {
        const headers = req.headers;
        const { userId } = req.params;

        if (!headers.authorization) {
            return res.status(401).json({ message: 'No authorization header sent' });
        }

        const token = headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
         
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
             
            if (err) {
                console.error('JWT verification error:', err);
                return res.status(401).json({ message: 'Unable to verify token' });
            }
             
            const { id, isVerified } = decoded;

            if (id !== userId) return res.status(403).json({ message: 'Not allowed to access that user\'s data' });
            if (!isVerified) return res.status(403).json({ message: 'You need to verify your email before you can access your data' });

            const db = getDbConnection('react-user-authentication-db');
            const user = await db.collection('users').findOne({ _id: ObjectID(id) });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(user);
        });
    }
};