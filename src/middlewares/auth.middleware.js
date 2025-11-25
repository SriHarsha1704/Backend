import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import User from '../models/user.model.js';

export const verifyJWT=asyncHandler(async(req,res,next)=>
{
    try{const token=req.cookies?.accesstokens || req.header("authorization").replace("Bearer","") // checks for the token in the cookies first if not found then checks at headers which has the syntax of authorization:bearer <token>
                                                        // if thr bearer is found it makes blank
    if(!token)
    {
        throw new ApiError(401,"No Token Found")
    }
    const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)  // the token we got from the bearer and the token in env is verified 

    const user=User.findById(decoded?._id).select("-password -refresh")  //after successfull decoding it gets the id of the token which consists the user details from then we use .select the user details eliminating the sensitive things 

    if(!user)
    {
        throw new ApiError(401,"Unauthorized Request")
    }

    req.user=user    // the user details are saved to database 
    next()           // this take to the next function in the route 
}
catch(error){
    throw new ApiError(401,"Invalid Access")
}
})