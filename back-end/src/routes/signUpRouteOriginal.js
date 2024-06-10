import { getDbConnection } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUpRoute =  {
    path: '/api/signup',
    method: 'post',
    handler: async (req, res) => {
        const { email, password } = req.body;
        const db = getDbConnection('react-user-authentication-db');
        const user = await db.collection('users').findOne({ email });

        if (user) {
            // conflict status code
            return res.status(409).send('User already exists');
        }

        const passwordHash = bcrypt.hashSync(password, 10);
        // now we want to save the user to the database
        const startingInfo = {
            name: '',
            job: '',
            jobSearch: [
                {
                    jobTitle: '',
                    company: '',
                    notes: '',
                    jobDescription: '',
                    applicationDate: '',
                    notes: '',
                    status: '',
                }
            ],
        };

        const result = await db.collection('users').insertOne({ email, passwordHash, info: startingInfo, isVerified: false});
        const { insertedId } = result;
        const token = jwt.sign({ 
            userId: insertedId,
            email,
            info: startingInfo,
            isVerified: false,
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2d' }, 
        (err, token) => {
            if (err) {
                console.error('Error creating token', err);
                return res.status(500).send('Error creating token');
            }
            res.status(200).json({ token });
        });
    }
}