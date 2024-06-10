import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const addJobRoute = {
    path: '/api/add-job/:userId',
    method: 'post',
    handler: async (req, res) => {
        const { authorization } = req.headers;
        const { userId } = req.params;

        const newJob = (({
            id,
            jobTitle,
            company,
            notes,
            jobDescription,
            applicationDate,
            interviewDate,
            status,
        }) => ({
            id: uuidv4(),
            jobTitle,
            company,
            notes,
            jobDescription,
            applicationDate,
            interviewDate,
            createdAt: new Date().toISOString(),
            status,
        }))(req.body);

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
            const result = await db.collection('users').updateOne(
                { _id: ObjectID(userId) },
                { $push: { "info.jobSearch": newJob } }
            );

            if (result.modifiedCount > 0) {
                return res.status(200).json({ message: 'Job added successfully' });
            } else {
                return res.status(500).json({ message: 'Error occurred while adding job' });
            }
        });
    }
};