
import {Router} from 'express';
import {Register} from '../controllers/user.controllers.js';
import {upload} from '../middlewares/multer.middleware.js'; // imported from middleware tp upload a file 

const Route = Router();

Route.route("/registeruser").post(
    upload.fields([                         //uploading a file 1. we have differnt ways to upload a file 
       {name:"avatar",
        maxCount:1},                        // we store here what we need to upload
        //{2}                               // we store in form of objects
    ]),
    Register);                              // gives the controllers message wheter satistfied or error

export default Route;   