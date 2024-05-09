//@ts-nocheck

import { isAdmin } from "../utils/common/middleware";

const expressRouter = require("express");

const router = new expressRouter.Router();

router.get("/type", (req, res) => {});

router.post("/type", isAdmin, async (req, res) => {});

module.exports = router;
