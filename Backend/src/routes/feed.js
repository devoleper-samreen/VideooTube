import express from "express";
import { getRandomVideos, getTrendingVideos, getMixedVideos } from "../controllers/videosFeedPipelines.js";

const router = express.Router();

router.get("/random", getRandomVideos);
router.get("/trending", getTrendingVideos);
router.get("/mixed", getMixedVideos);

export default router;
