import express from "express";
import { verifyToken } from "../middelwares/verifyJWT.js";
import {
  getStats,
  deleteVideo,
  updateVideo,
} from "../controllers/dashboard.js";
import { upload } from "../middelwares/multur.js";

const router = express.Router();
router.use(verifyToken);

router.get("/get-stats", getStats);
router.delete("/:videoId", deleteVideo);
router.patch(
  "/:videoId",
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateVideo
);

export default router;
