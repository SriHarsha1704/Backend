
import {Router} from 'express';
import {Register} from '../controllers/user.controllers.js';

const Route = Router();

Route.route("/registeruser").post(Register);

export default Route;