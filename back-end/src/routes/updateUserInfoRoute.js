import { getDbConnection } from '../db';
import { ObjectID } from 'mongodb';
import jwt from 'jsonwebtoken';

export const updateUserInfoRoute = {
    path: '/api/update-user-info/:userId',
    method: 'put',
    handler: async (req, res) => {
        const authorization = req.headers['authorization'];
        const { userId } = req.params;

        // to update the user info, name and job 
        const updates = (({
            name,
            job,
        }) => ({
            name,
            job,
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
                { _id: ObjectID(userId) },
                {
                    $set: {
                        "info.name": updates.name,
                        "info.job": updates.job,
                    }
                },
                { returnOriginal: false },
            );

            if (!result.value) {
                return res.status(500).json({ message: 'Error updating user info' });
            }

            res.status(200).json(result.value);
        });

    }
}