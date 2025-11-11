import mongoose,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
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

UserSchema.methods.passwordcorrect=async function(password){  // UserSchema.methods is used to create the custom methods like a function
    return bcrypt.compare(password,this.password);  // bcypt.compare is used to compare the input password and this.password gives the hased password for that stored user
}  
UserSchema.methods.generateAccessToken=function()   // here we create function called generateAccessToken we call this from frontend when the details are given 
{                                                   // here when the function is called it creates a token based on the HEADER.PAYLOAD.SIGNATURE with the help of SECRET_API_KEY
    return jwt.sign({                               // then we verify the generated token based on the user details with the secret access key if verified then it contiues
        _id:this._id,
        email:this.email,
        password:this.password          
},
process.env.ACCESS_TOKEN_SECRET,
process.env.ACCESS_TOKEN_EXPIRY)                     // it has a specific time if expires then it does not allow 
}

UserSchema.method.generateRefreshToken=function()    // this generates the refresh token which is used to generate the access token whenever expired 
{
    return jwt.sign({                                // just verifies with the generated token with the secret refresh token and generates new access token until expiry
        id:this._id
    },process.env.REFRESH_TOKEN_SECRET,
        process.env.REFRESH_TOKEN_EXPIRY)            // after refresh token expiry then we need to login with creds again which follows the generation of new access tokne and same procedure with line:54
}
const User=mongoose.model("User",UserSchema); //mongoose.model creates the schema into model User changes to users and UserSchema is the refernce 

export default User;  // exporting the model we take the datafrom database using the user 
