import express from "express";
import { findOrCreateUserDetails } from "./controllers/Users.js";

const router = express.Router();

router.post("/findOrCreateUserDetails", (req, res) => {
  findOrCreateUserDetails(req, res);
});

export default router;
