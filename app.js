import express from 'express';
import { dbutil } from './connect/dbconnect.js';
import userrouter from './router/userrouter.js'
import dotenv from 'dotenv'
dotenv.config();
const app =express();
app.use(express.json());
const PORT = process.env.PORT

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use("/",userrouter);

app.listen(PORT,()=>{
    console.log(`Server running on port http://localhost:${PORT}`);
})