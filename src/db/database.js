import mongoose from 'mongoose';
import express from 'express';
const app = express(); 
const  DB=async ()=>
{
    try{
          await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
          console.log("DATABASE CONNECTED");
    }
    catch(error)
    {
        console.log("ERROR CONNECTION",error);
    }
} 
export default DB;