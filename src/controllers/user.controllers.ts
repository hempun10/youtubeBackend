import { error } from "console";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  const { fullName, email, username, password } = req.body;
  console.log(fullName, email, username, password);
  //validation -> not empty
  if (
    [fullName, email, username, password].some(
      (field: string) => field?.trim() === ""
    )
  ) {
    throw new ApiError(404, "All field are required");
  }
  //check if user already exists : username & email

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }
  //check for images -> avatar & coverImage
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const avatarLocalPath = files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(files.coverImage) &&
    files.coverImage.length > 0
  ) {
    coverImageLocalPath = files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar file is required");
  }
  //upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath!);

  if (!avatar) {
    throw new ApiError(404, "Avatar file is required");
  }
  //create user object -> create entry in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  //check for user creation response  // remove password and refresh token field form the response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  //return res
  return res
    .status(201)
    .json(new ApiResponse(200, "User Register Sucessfully", user, true));
});

export const loginUser = asyncHandler(async (req, res) => {
  //get data from frontend
  const { username, email, password } = req.body;

  //Check username / email
  //username or email
  if (!username || !email) {
    throw new ApiError(404, "username or email is required");
  }
  //check password
  if (!password) {
    throw new ApiError(404, "Password is required");
  }
  //find user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesnot exist");
  }
  //password check
  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Password Incorrect");
  }
  //access and refresh token generate
  const { acesstoken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  console.log(user);

  //send cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  }; //Make sure cookies is only mutable by server

  //response
  return res
    .status(200)
    .cookie("accessToken", acesstoken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        "Logged in Successfully",
        { user: loggedInUser, acesstoken, refreshToken },
        true
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  //Extract userId from req
  const user_id = req.user?._id;
  await User.findByIdAndUpdate(
    user_id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  }; //Make sure cookies is only mutable by server

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logout", {}, true));
});
