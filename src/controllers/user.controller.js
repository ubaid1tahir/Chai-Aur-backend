import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username, fullname, email,password} = req.body;
    console.log("Email:", email)


    if([username, fullname, email, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedEmail = User.findOne({email})
    const existedUsername = User.findOne({username})

    console.log("ExistedEmail :",existedEmail)
    console.log("ExistedUsername :",existedUsername)
    
    if(existedEmail != undefined){
        throw new ApiError(409, "Email already existed")
    }

    else if(existedUsername){
        throw new ApiError(408, "Username already existed")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }
    
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(coverImageLocalPath){
        const coverImage = await upload(coverImageLocalPath);
    }

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password
    })

    const userIsCreated = await User.findById(user._id).select("-password -refreshToken");

    if(!userIsCreated){
        throw new ApiError(500, "Something went wrong when registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, userIsCreated, "USER created Successfully")
    )
})

export {registerUser}