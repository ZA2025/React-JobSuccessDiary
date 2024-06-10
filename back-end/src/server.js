import express from 'express';
import { routes } from './routes'; // Adjust the path if necessary
import { initializeDbConnection } from './db';
import cors from 'cors';

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());

// Add all the routes to our Express server
// exported from routes/index.js
routes.forEach(route => {
    app[route.method](route.path, route.handler);
});

initializeDbConnection()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    });