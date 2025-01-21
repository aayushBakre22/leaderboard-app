import { Claim } from "../models/claim.model.js";
import { User } from "../models/user.model.js";
import { emitEvent } from "../socket.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import fs from "fs";

const createUser = async (req, res, next) => {
  try {
    const { name, username } = req.body;
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!name || !username) {
      if (avatarLocalPath) {
        fs.unlinkSync(avatarLocalPath);
      }
      throw new ApiError(400, "Missing Details");
    }
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      if (avatarLocalPath) {
        fs.unlinkSync(avatarLocalPath);
      }
      throw new ApiError(400, "This username already exists!");
    }
    let avatar;
    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new ApiError(400, "Could not upload avatar on cloudinary");
      }
    } else {
      avatar = {
        url: "https://res.cloudinary.com/dlsnwre9a/image/upload/v1736778700/default-avatar_wvjtkr.jpg",
      };
    }
    const user = await User.create({
      name,
      username,
      avatar: avatar.url,
    });
    if (!user) {
      throw new ApiError(500, "Could not create user");
    }
    emitEvent("userCreated", user);
    return res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully!"));
  } catch (error) {
    next(error);
  }
};

const claimPoints = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new ApiError(400, "Missing ID");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const points = Math.floor(Math.random() * 10) + 1;
    let claim = await Claim.create({
      user: userId,
      pointsClaimed: points,
    });
    if (!claim) {
      throw new ApiError(500, "Error claiming points");
    }
    user.points += points;
    user.claimHistory = [...user.claimHistory, claim._id];
    const updatedUser = await user.save();
    if (!updatedUser) {
      Claim.findByIdAndDelete(claim._id);
      throw new ApiError(500, "Error updating user");
    }
    claim = { ...claim.toObject(), user: { username: updatedUser.username } };
    emitEvent("pointsUpdated", updatedUser);
    emitEvent("claimAdded", claim);
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedUser, "Points added to user successfully")
      );
  } catch (error) {
    next(error);
  }
};

const topUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ points: -1 }).limit(10);
    if (!users) {
      throw new ApiError(500, "Could not fetch users");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const allUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    if (!users) {
      throw new ApiError(500, "Could not fetch users");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    next(error);
  }
};

const editUser = async (req, res, next) => {
  const { userId, username, name } = req.body;
  if (!userId) {
    throw new ApiError(400, "Missing ID");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (username) {
    user.username = username;
  }
  if (name) {
    user.name = name;
  }
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(500, "Could not upload avatar on cloudinary");
    }
  }
  if (avatar) {
    user.avatar = avatar.url;
  }
  const updatedUser = await user.save();
  if (!updatedUser) {
    Claim.findByIdAndDelete(claim._id);
    throw new ApiError(500, "Error updating user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User edited successfully"));
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new ApiError(400, "Missing ID");
    }
    const deletedClaims = await Claim.deleteMany({ user: userId });
    if (!deletedClaims) {
      throw new ApiError(500, "Error deleting claims");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const deletedAvatar = await deleteFromCloudinary(user.avatar);
    if (!deletedAvatar) {
      throw new ApiError(500, "Error deleting claims");
    }
    const deletedUser = await User.deleteOne({ _id: userId });
    if (!deletedUser) {
      throw new ApiError(500, "Error deleting claims");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { deletedUser, deletedAvatar, deletedClaims },
          "User deleted successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { text } = req.params;
    const results = await User.find({
      $or: [
        { username: { $regex: text, $options: "i" } },
        { name: { $regex: text, $options: "i" } },
      ],
    });
    return res
      .status(201)
      .json(new ApiResponse(201, results, "Search results"));
  } catch (error) {
    next(error);
  }
};

const sendUpdatedUsers = async (io, username) => {
  try {
    const users = await User.find({});
    io.emit("updatedUsers", users);
  } catch (error) {
    next(error);
  }
};

const getClaims = async (req, res, next) => {
  const { page = 0, limit = 10 } = req.query;
  const skip = page * limit;
  try {
    const claims = await Claim.find()
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("user", "username");

    return res.status(201).json(new ApiResponse(201, claims, "Latest Claims"));
  } catch (error) {
    next(error);
  }
};

export {
  createUser,
  claimPoints,
  allUsers,
  topUsers,
  editUser,
  deleteUser,
  search,
  sendUpdatedUsers,
  getClaims,
};
