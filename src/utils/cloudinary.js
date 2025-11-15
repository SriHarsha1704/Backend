import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
//we need to configure the cloudinary by using the cloudinary account and these name,api_key,api_secret
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const uploadoncloudinary = async (localFilePath)=>{   //LocalFilePath takes the path of the file that is being uploaded 
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
export {uploadoncloudinary}
