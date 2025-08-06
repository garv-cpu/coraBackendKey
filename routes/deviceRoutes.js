import express from "express";
import {
  getAllDevices,
  registerDevice,
  controlDevice,
} from "../controllers/deviceController.js";

const router = express.Router();

router.get("/", getAllDevices);
router.post("/register", registerDevice);
router.post("/:deviceId/control", controlDevice);

export default router;
