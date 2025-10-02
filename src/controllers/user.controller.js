import { asyncHandler } from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
       //get user details from frontend
       //validation - not empty, email format, password strength
       //check if user already exists: username or email
       // check for images, check for avatar
       // upload image to cloudinary
       // create user object - create entry in db
       // remove password and refresh token from response
       // check for user creation success
       // return response to frontend


       const {fullName, email, username, password} = req.body
       console.log("email: ", email);

      if (
        [fullName, email, username, password].some((field) => field?.trim() === '')
      ) {
        throw new ApiError(400, 'All fields are required');
      }
      
        const existedUser = User.findOne({
            $or: [{ email }, { username }]
        })
        if(existedUser){
            throw new ApiError(409, 'User already exists with this email or username')
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if(!avatarLocalPath){
            throw new ApiError(400, 'Avatar is required')
        }
        //upload to cloudinary
        const avatar = await uploadToCloudinary(avatarLocalPath)
        const coverImage = await uploadToCloudinary(coverImageLocalPath)

         if(!avatar){
            throw new ApiError(400, 'Avatar is required')
        }

        const user = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || '',
            email,
            username: username.toLowerCase(),
            password
        })

        const createdUser = await User.findById(user._id).select('-password -refreshToken')
          
        if(!createdUser){
            throw new ApiError(500, 'User creation failed')
        }

        return res.status(201).json(
            new ApiResponse(200 ,'User created successfully', createdUser
        ))

    })

export { registerUser };