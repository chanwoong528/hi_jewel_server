//@ts-nocheck

import RESPONSE_CODE from "../utils/CONSTANT/RESPONSE_CODE";
import ERROR_CODE from "../utils/CONSTANT/ERROR_CODE";

import { upsertProductTypeOrder } from "../service/orderService";
import { isAdmin } from "../utils/common/middleware";
import { CustomError } from "../utils/exceptions/CustomError";

const expressRouter = require("express");

const router = new expressRouter.Router();

router.patch("/type", isAdmin, async (req, res) => {
  try {
    const { orderEditList } = req.body;
    if (!orderEditList || orderEditList.length < 1) {
      throw new CustomError("NotFoundError", "orderEditList is Empty");
    }
    const returnResult = await Promise.all(
      orderEditList.map(async (orderItem) => {
        const returnData = await upsertProductTypeOrder(
          orderItem.id,
          orderItem.order
        );
        return returnData;
      })
    );

    return res
      .status(RESPONSE_CODE["patch"](returnResult).code)
      .send(RESPONSE_CODE["patch"](returnResult));
  } catch (error) {
    console.warn("error in update productTypeOrder", error);
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

module.exports = router;
