
import {Router} from 'express';
import {logoutUser, Register} from '../controllers/user.controllers.js';
import {upload} from '../middlewares/multer.middleware.js'; // imported from middleware tp upload a file 
import { verifyJWT } from '../middlewares/auth.middleware.js';

const Route = Router();

Route.route("/registeruser").post(
    upload.fields([                         //uploading a file 1. we have differnt ways to upload a file 
       {name:"avatar",
        maxCount:1}, 
        {name:"coverimage",
        maxCount:1}                       // we store here what we need to upload
        //{2}                               // we store in form of objects
    ]),
    Register); 
Route.route("/Login").post(loginUser)     // gives the controllers message wheter satistfied or error
Route.route("/Logout").post(verifyJWT,logoutUser)  // when logout is called it goes to the middleware verifies the user using the token and then confirms and send the data and then clears the refresh token then logouts 

export default Route;   