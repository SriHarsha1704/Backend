// routes import 
import express from 'express';
const app2 = express();
import routers from './routes/user.route.js';

app2.use("/api/v1/user",routers)

export default app2;