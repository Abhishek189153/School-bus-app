import express from "express";

import
{
    getWorkingDays,
    updateWorkingDays,
}
from "../controllers/workingDay.controller.js";

import
{
    protect,
    authorize,
}
from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    getWorkingDays
);

router.put(
    "/",
    protect,
    authorize("SCHOOL_ADMIN"),
    updateWorkingDays
);

export default router;