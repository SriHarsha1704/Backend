// routes import 
import express from 'express';
const app = express();
import routers from './routes/user.route.js';

app.use(express.json({ limit: "16kb" }));  // Limit the user JSON data large data is not processed
app.use(express.urlencoded({ extended: true, limit: "16kb" }));  //express.urlencoded reads the data in the HTML form 

app.use("/api/v1/user",routers)    //uses this as default for all the routes /api/v1/user/home or /login.....   

export default app;