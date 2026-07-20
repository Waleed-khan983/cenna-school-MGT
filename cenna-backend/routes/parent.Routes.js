import express from "express";
import { uploadImage } from "../config/cloudinary.js";

import {
  getMyParentProfile,
  getParents,
  getParent,
  createParent,
  updateParent,
  deleteParent,
  getMyChildrenAttendance,
  getMyChildrenResults,
  getMyChildrenAssignments,
  getMyChildrenFees,
  getMyChildrenRemarks,
  updateProfileImage,
} from "../controllers/parentController.js";

import {
  protect,
  adminOnly,
  authorize,
} from "../middleware/auth.js";

const router = express.Router();

/* Parent Self Routes */

router.get(
  "/me",
  protect,
  authorize("parent"),
  getMyParentProfile
);

router.get(
  "/attendance",
  protect,
  authorize("parent"),
  getMyChildrenAttendance
);

router.get(
  "/results",
  protect,
  authorize("parent"),
  getMyChildrenResults
);

router.get(
  "/fees",
  protect,
  authorize("parent"),
  getMyChildrenFees
);

router.get(
  "/assignments",
  protect,
  authorize("parent"),
  getMyChildrenAssignments
);

router.get(
  "/remarks",
  protect,
  authorize("parent"),
  getMyChildrenRemarks
);





router.put(
  "/profile-image",
  protect,
  authorize("parent"),
  uploadImage.single("image"),
  updateProfileImage
);

/* Admin Routes */

router.get(
  "/",
  protect,
  adminOnly,
  getParents
);

router.post(
  "/",
  protect,
  adminOnly,
  createParent
);

router.get(
  "/:id",
  protect,
  adminOnly,
  getParent
);

router.put(
  "/:id",
  protect,
  authorize("admin", "parent"),
  updateParent
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteParent
);

export default router;