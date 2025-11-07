import {asyncHandler} from '../utils/asyncHandler.js';

const Register = asyncHandler( async (req,res)=>
{
    res.status(200).json({
        message:"OK"
    })
})

export {Register}