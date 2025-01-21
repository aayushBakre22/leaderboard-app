import { Router } from "express";
import {
  allUsers,
  claimPoints,
  createUser,
  deleteUser,
  editUser,
  getClaims,
  search,
  topUsers,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();

userRouter.route("/createUser").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  createUser
);

userRouter.route("/claimPoints").post(claimPoints);

userRouter.route("/getClaims").get(getClaims);

userRouter.route("/topUsers").get(topUsers);

userRouter.route("/allUsers").get(allUsers);

userRouter.route("/editUser").patch(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  editUser
);

userRouter.route("/deleteUser").delete(deleteUser);

userRouter.route("/search/:text").get(search);

export default userRouter;
