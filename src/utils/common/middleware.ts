//@ts-nocheck
import { verifyToken } from "./authUtil";
import ERROR_CODE from "../CONSTANT/ERROR_CODE";

export function isLoggedIn(req, res, next) {
  const accessToken = req.cookies.access_token;
  const compareResult = verifyToken(accessToken);
  console.log("compareResult", compareResult);
  console.log("accessToken", accessToken);
  if (!compareResult.validity) {
    return res
      .status(ERROR_CODE[compareResult.data].code)
      .send(ERROR_CODE[compareResult.data]);
  }

  next();
}

export function isAdmin(req, res, next) {
  const accessToken = req.cookies.access_token;
  const compareResult = verifyToken(accessToken);

  if (!compareResult.validity) {
    return res
      .status(ERROR_CODE[compareResult.data].code)
      .send(ERROR_CODE[compareResult.data]);
  }
  if (compareResult.data.role !== "admin") {
    return res
      .status(ERROR_CODE["AuthorizeLevelNotMatch"].code)
      .send(ERROR_CODE["AuthorizeLevelNotMatch"]);
  }

  next();
}
