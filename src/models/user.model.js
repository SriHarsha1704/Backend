import mongoose,{schema} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name :                                       // this is the name of the user gives the feild name
    {
        required : true,                          // these all describes the properties of the name feild
        type : String,
        unique : true,
        trim : true,
        lowercase:true
    },
    email:{
        type: String,
        required:true,
        unique:true,

    },
    password:{
        type: String,
        required:[true,"Password is mandatory"],
    },
    avatar:{
        type: String,
        required: false,
    },
    coverimage:{
        type: String,
        required: false,
    },
    watchHistory:{
        type:Schema.Types.ObjeectId,
        ref:"video"
    },
    refreshToken:{
        type:String,
        default:""
    }
},
    {
        timestamps:true
    }
);
UserSchema.pre("save",async function(next){   // pre describes the function before saving the data and "save" saves the data
    if(this.isModified("password")==false)    //  isModifies is a prebuilt function checks wheter the particular thinsg is modified from the first time
    {
        next();                                // indicates that it is done 
    }
    this.password=await bcrypt(this.password,10);   // if is modifies is false then it will hash the passwrod and encrypts it 
    next();
})

UserSchema.methods.passwordcorrect=async function(passsword){  // UserSchema.methods is used to create the custom methods like a function
    return bcrypt.compare(password,this.password);  // bcypt.compare is used to compare the input password and this.password gives the hased password for that stored user
}  
const User=mongoose.model("User",UserSchema); //mongoose.model creates the schema into model User changes to users and UserSchema is the refernce 

export default User;  // exporting the model we take the datafrom database using the user 
