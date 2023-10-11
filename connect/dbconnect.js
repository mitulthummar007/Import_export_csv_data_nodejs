import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const URL = process.env.URL;

export const dbutil = mongoose.connect(URL).then(()=>{
    console.log("DB Connected...");
}).catch(err=>{
    console.log(err);
})