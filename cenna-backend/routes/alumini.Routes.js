import express from "express";

import {
    registerAlumni,
    getAlumniRegistrations,
    approveAlumni,
    deleteAlumni,

} from "../controllers/aluminiController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerAlumni);

router.get("/", protect, adminOnly, getAlumniRegistrations);




router.put(
    "/approve/:id",
    protect,
    adminOnly,
    approveAlumni
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteAlumni
);

export default router;