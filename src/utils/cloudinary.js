import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
//we need to configure the cloudinary by using the cloudinary account and these name,api_key,api_secret
cloudinary.config({
    cloudname: process.env.CLOUDINARY_CLOUD_NAME,
    cloudapikey: process.env.CLOUDINARY_API_KEY,
    cloudapisecret: process.env.CLOUDINARY_API_SECRET
})
const uploadOnCloudinary = async (localFilePath)=>{   //LocalFilePath takes the path of the file that is being uploaded 
    try{ 
        // if no path is identified error is generated 
        if(localFilePath==false)
        {
            return null;
        }
        //cloudinary.uploader.upload used to upload the file takes two arguments 1) file path 2) resource type 
    const response = await cloudinary.uploader.upload(localFilePath,
    {
     resource_type: "auto"  // identifies whether the file is image,doc,etc....
    })
    fs.unlinkSync(localFilePath) //synchronously unlinks the file after uploading to save the localdisk storage 
    return response;   //  return the generated URL from the cloudinary after uploading the image 
    }  
    catch(error)
    {
        fs.unlinkSync(localFilePath);  //  unlinks when the error is generated 
        return null;
    }
    
}
export {uploadOnCloudinary}
