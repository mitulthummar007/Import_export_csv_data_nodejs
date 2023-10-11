import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
    first_name:{
        type: String,
        require: true
    },
    last_name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    gender:{
        type: String,
        require: true
    }
})

const UserModel = mongoose.model('user',Userschema);
export default UserModel;