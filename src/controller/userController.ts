//@ts-nocheck

const expressRouter = require("express");

const router = new expressRouter.Router();

router.get("/", () => {
  console.log("!!!useruser");
});

module.exports = router;
