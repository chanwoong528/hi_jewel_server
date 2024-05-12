//@ts-nocheck
import RESPONSE_CODE from "../utils/CONSTANT/RESPONSE_CODE";
import ERROR_CODE from "../utils/CONSTANT/ERROR_CODE";

import { getStatsByType, upsertStat } from "../service/statService";

const expressRouter = require("express");

const router = new expressRouter.Router();

router.patch("/", async (req, res) => {
  const { date, type, productId, userAgent } = req.body;
  try {
    const returnResult = await upsertStat({ date, type, productId, userAgent });
    return res
      .status(RESPONSE_CODE["patch"](returnResult).code)
      .send(RESPONSE_CODE["patch"](returnResult));
  } catch (error) {
    console.warn("error in update productTypeOrder", error);
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

export enum GetStatType {
  totalProductCount = "totalProductCount",
  viewsByDateArr = "viewsByDateArr",
}

router.get("/", async (req, res) => {
  try {
    const { type, curDate } = req.query;

    const result = await getStatsByType(type, curDate);
    return res
      .status(RESPONSE_CODE["retrieve"](result).code)
      .send(RESPONSE_CODE["retrieve"](result));
  } catch (error) {
    console.warn("error in getting stats", error);
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

module.exports = router;
