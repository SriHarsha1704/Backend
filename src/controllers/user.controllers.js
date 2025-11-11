import {asyncHandler} from '../utils/asyncHandler.js';
import User from '../models/user.model.js';
import {ApiResponse as AR} from '../utils/ApiResponse.js';

const Register = asyncHandler( async (req,res)=>
{
    res.status(200).json({
        message:"OK"
    })

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
   const repeteadUser=user.findOne({      //takes the data from db using the findOne method and checks                                      //if the email or fullName is already present in the db
    $or:[{email},{fullName}]               // checks for email and fullName
   })
   if(repeteadUser==true)                          // boolean value if true throws error to frontend
   {
    throw new ApiError(409,"User already exists");
   } 

   const avatar=req.files?.avatar[0]?.path;
   const coverpicture=req.files?.coverpicture[0]?.path; // takes the image from frontend and stores it in the db
    if(avatar==false)
    {
        throw new ApiError(400,"First image is required"); // if no image is provided throws error
    }

    const first= await uploadoncloudinary(avatar);   // uploads image to cloudinary and returns the url
    const second= await uploadoncloudinary(coverpicture);  // awaits for the image to be uploaded before proceeding
    if(first==false)
    {
        throw new ApiError(400,"First image is required");
    }   
    const user= await DB.create(
    {
        fullName,
        email,
        password,
        avatar:first.url,
        coverpicture:second?.url || "",
    })

    const createdUser=await User.findById(user._id).select(    // mongoDB allocates each user with wih a unique ID which can be retrieved by _id
        "-password -refreshToken"                              //select gets all the user details by ID and - indicates that feilds should not be selected on retriveing 
    )

    if(createdUser==false){
        throw new ApiError(500,"Internal Server Error");   // if no user found/created it throws error
    }
     return res.status(201).json(
        new AR(200,createdUser,"User Registered Succesfully")  // returning the crested user message using ApiResponse class imported as AR which gives the response in PostMan
     )
    
})

export {Register}