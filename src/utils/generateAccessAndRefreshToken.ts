import { User } from "../models/user.model.js";
import ApiError from "./ApiError.js";

export const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    if (!userId) {
      throw new ApiError(404, "UserId is not provided");
    }
    const user = await User.findById(userId);
    const acesstoken = await user.generateAcessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { acesstoken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Refresh and Acess Token"
    );
  }
};
