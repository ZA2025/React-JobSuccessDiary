import { CognitoUser } from "amazon-cognito-identity-js";
import { awsUserPool } from "../util/awsUserPool";

export const forgotPasswordRoute = {
    path: '/api/forgot-password',
    method: 'put',
    handler: async (req, res) => {
        const { email } = req.body;
        new CognitoUser({ Username: email, Pool: awsUserPool }).forgotPassword({
            onSuccess: () => {
                res.sendStatus(200);
            },
            onFailure: err => {
                res.status(500).json({ message: err.message });
            }
        });
    }
}