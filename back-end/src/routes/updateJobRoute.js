import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

export const updateJobRoute = {
    path: '/api/update-job/:userId/:jobId',
    method: 'put',
    handler: async (req, res) => {
        const { authorization } = req.headers;
        const { userId, jobId } = req.params;

        const updates = (({
            jobTitle,
            company,
            notes,
            jobDescription,
            applicationDate,
            interviewDate,
            status,
        }) => ({
            jobTitle,
            company,
            notes,
            jobDescription,
            applicationDate,
            interviewDate,
            status,
        }))(req.body);

        if (!authorization) {
            return res.status(401).json({ message: 'No authorization header sent' });
        }

        const token = authorization.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) return res.status(401).json({ message: 'Unable to verify token' });

            const { id, isVerified } = decoded;
            
            if (id !== userId) {
                return res.status(403).json({ message: 'Not allowed to access that user\'s data' });
            }
            if (!isVerified) {
                return res.status(403).json({ message: 'You need to verify your email before you can access your data' });
            }

            const db = getDbConnection('react-user-authentication-db');
            const result = await db.collection('users').findOneAndUpdate(
                { _id: ObjectID(userId), "info.jobSearch.id": jobId },
                { 
                    $set: {
                        "info.jobSearch.$.jobTitle": updates.jobTitle,
                        "info.jobSearch.$.company": updates.company,
                        "info.jobSearch.$.notes": updates.notes,
                        "info.jobSearch.$.jobDescription": updates.jobDescription,
                        "info.jobSearch.$.applicationDate": updates.applicationDate,
                        "info.jobSearch.$.interviewDate": updates.interviewDate,
                        "info.jobSearch.$.status": updates.status,
                    }
                },
                { returnOriginal: false },
            );

            if (result.ok) {
                return res.status(200).json({ message: 'Job updated successfully' });
            } else {
                return res.status(500).json({ message: 'Error occurred while updating job' });
            }
        });
    }
};