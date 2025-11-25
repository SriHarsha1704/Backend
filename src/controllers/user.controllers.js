import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import {ApiResponse, ApiResponse as AR} from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadoncloudinary } from '../utils/cloudinary.js';
import { application } from 'express';
const generateAccessandRefreshtokens=async(userId)=>
    {
        try {
            const user = await User.findById(userId);
            const access= user.generateAccessToken();
            const refresh=user.generateRefreshToken();
            user.refresh=refresh
            await user.save({
            validateBeforeSave:false
            })
        } catch (error) {
            console.log("Something error occured",error)
            
        }
        return {access,refresh}
    }
const Register = asyncHandler( async (req,res)=>
{
    const {fullName,email,password}=req.body;  // takes the information from frontend part
    if(fullName=="")
    {
        throw new ApiError(400,"Full name is required");
    }
    if(
        [fullName,email,password].some((field)=>field=="")       // this way or all at once can be done 
    ){
        throw new ApiError(400,"All fields are required");
    }
   const repeteadUser= await User.findOne({      //takes the data from db using the findOne method and checks                                      //if the email or fullName is already present in the db
    $or:[{email},{fullName}]               // checks for email and fullName
   })
   if(repeteadUser)                          // boolean value if true throws error to frontend
   {
    throw new ApiError(409,"User already exists");
   } 

const avatarLocalPath = req.files?.avatar?.[0]?.path;
const coverImageLocalPath = req.files?.coverimage?.[0]?.path; // takes the image from frontend and stores it in the db
    
   const avatar = avatarLocalPath ? avatarLocalPath.replace(/\\/g, "/") : undefined;
    const coverimage = coverImageLocalPath ? coverImageLocalPath.replace(/\\/g, "/") : undefined;

   const first= await uploadoncloudinary(avatar);   // uploads image to cloudinary and returns the url
    const second= await uploadoncloudinary(coverimage);  // awaits for the image to be uploaded before proceeding
    if(!first)
    {
        throw new ApiError(400,"First image is required");
    }   
    const user= await User.create(
    {
        fullName,
        email,
        password,
        avatar:first.url,
        coverimage:second?.url || "",
    })

    const createdUser=await User.findById(user._id).select(    // mongoDB allocates each user with wih a unique ID which can be retrieved by _id
        "-password -refreshToken"                              //select gets all the user details by ID and - indicates that feilds should not be selected on retriveing 
    )

    if(!createdUser){
        throw new ApiError(500,"Internal Server Error");   // if no user found/created it throws error
    }
     return res.status(201).json(
        new AR(201,createdUser,"User Registered Succesfully")  // returning the crested user message using ApiResponse class imported as AR which gives the response in PostMan
     )
    
})

const loginUser=asyncHandler(async (req,res)=>
{
    const {email,password}=req.body;   // gets details from frontend
    if(!email && !password)
    {
        throw new ApiError(400,"Both fields are required");   //checks for required things 
    }
    const existingUser=User.findOne({     //.findone checks for the particular field  with the help of $or:[{}]
        $or:[{email}]
    })
    if(!existingUser)
    {
        throw new ApiError(404,"User does not exist")
    }
    const ispasswordcorrect=existingUser.passwordCorrect(password); //password correct we got from  usermodel.js

    if(!ispasswordcorrect)
    {
        throw new ApiError(404,"Wrong not valid")     //checks for correct password
    }
    const {access,refresh}= await generateAccessandRefreshtokens(User._id)   //declared a method for creating  access and refrsh tokens 

    const loggedIn=User.findById(existingUser._id)   // extracting the detais of the specificUser
    .select("-password -refresh")                      // eliminating the password and refresh using select key word

    const options={
        httpOnly:true,      // both are used for security purpose which frontend cannot modify the details
        secure:true         // only server modifies the details   
    }

    return res                       // sending the response in the form of cookies using .cookies
    .status(200)
    .cookie("access",access,options)
    .cookie("refresh",refresh,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedIn,access,refresh
            },
            "User Logged In Successfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>
{
   await User.findByIdAndUpdate(             //findByIdAndUpdate and searches and updates 
        req.user._id,                        // we get the info of this particular user using this line because we use miidleware 
        {                                      // thse middleware is present in the route first verifes and then sends the user details 
            $set:                      
            {
                refresh:undefined                    //makes the refresh token blank
            }
        },
        {
            new : true                
        }
    )
     const options={
        httpOnly:true,      // both are used for security purpose which frontend cannot modify the details
        secure:true         // only server modifies the details   
    }
    return res
    .status(200)
    .clearCookie("access",options)
    .clearCookie("refresh",options)
    .json(200,{},"User Logged out Succesfully")
})


export {Register,loginUser,logoutUser}