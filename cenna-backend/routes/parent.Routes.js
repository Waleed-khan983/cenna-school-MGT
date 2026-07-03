import express from "express";
import uploadParent from "../middleware/uploadParent.js";

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





router.put(
  "/profile-image",
  protect,
  authorize("parent"),
  uploadParent.single("image"),
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