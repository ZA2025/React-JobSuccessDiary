import { getDbConnection } from '../db';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export const getJobSearchRoute = {
    path: '/api/job/:userId/:jobId',
    method: 'get',
    handler: async (req, res) => {
        const { authorization } = req.headers;
        const { userId, jobId } = req.params;
        //console.log(authorization, userId, jobId);

        if (!authorization) {
            return res.status(401).json({ message: 'No authorization header sent' });
        }
        const token = authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unable to verify token' });
            }
            const { id, isVerified } = decoded;
            if (id !== userId) {
                return res.status(403).json({ message: 'Not allowed to access that user\'s data' });
            }
            if (!isVerified) {
                return res.status(403).json({ message: 'You need to verify your email before you can access your data' });
            }

            const db = getDbConnection('react-user-authentication-db');
            const user = await db.collection('users').findOne({ _id: ObjectId(userId) });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const job = user.info.jobSearch.find(job => job.id === jobId);

            if (!job) {
                return res.status(404).json({ message: 'Job not found' });
            }
            res.status(200).json(job);

        });
    },
};