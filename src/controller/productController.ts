//@ts-nocheck

const expressRouter = require("express");

const router = new expressRouter.Router();

router.get("/", () => {
  console.log("!!!product");
});

/** create product type  */
router.post("/type", (res, req) => {});

module.exports = router;
