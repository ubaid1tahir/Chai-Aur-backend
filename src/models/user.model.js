import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true // true if you have to use this field in searching
    },
    fullname: { type: String, required: true, trim: true},
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type:String
    },
    password: {
        type:String,
        required: [true, 'Password is required']
    },
    watchHistory: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Video'
        }
    ],
    refreshToken: {
        type: String,
    }

}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.modified("password")) return next();
    this.password = bcrypt(this.password, 10);
    next();
})

userSchema.methods.isCorrectPassword = async function(password){
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}


export default User = mongoose.model('User',userSchema);