//@ts-nocheck

import { createUser, getSingleUser } from "../service/userService";
import {
  genAccToken,
  genPw,
  genRefToken,
  comparePw,
  verifyToken,
} from "../utils/common/authUtil";

import { UserParam } from "../service/userService";
import RESPONSE_CODE from "../utils/CONSTANT/RESPONSE_CODE";
import ERROR_CODE from "../utils/CONSTANT/ERROR_CODE";
import { CustomError } from "../utils/exceptions/CustomError";

const expressRouter = require("express");

const router = new expressRouter.Router();

//user get
router.get("/:userId", () => {});

// User Register
router.post("/register", (req, res) => {
  const { type, email, pw } = req.body;
  const hashedPw = genPw(type, pw);
  let userParam: UserParam = {
    type: type,
    email: email,
    pw: hashedPw,
  };

  createUser(userParam)
    .then((result) => {
      return res
        .status(RESPONSE_CODE["created"](result).code)
        .send(RESPONSE_CODE["created"](result));
    })
    .catch((error) => {
      console.warn(error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

//User update
router.patch("/update", (req, res) => {});

// User Login -> return accessToken, refreshToken
router.post("/login", (req, res) => {
  const { type, email, pw } = req.body;
  getSingleUser(undefined, type, email)
    .then(async (result) => {
      const verifyPw = await comparePw(pw, result.pw);
      console.log(verifyPw);
      if (!!verifyPw) {
        const accessToken = genAccToken(
          result.id,
          result.type,
          result.email,
          result.role
        );
        const refreshToken = genRefToken(
          result.id,
          result.type,
          result.email,
          result.role
        );
        res.cookie("access_token", accessToken);
        res.cookie("refresh_token", refreshToken);
        return res
          .status(RESPONSE_CODE["created"](result).code)
          .send(RESPONSE_CODE["created"](result));
      }
      throw new CustomError("PasswordIncorrectError", "password not matched");
    })
    .catch((error) => {
      console.warn(error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

// User login with refreshToken -> return accessToken
router.post("/generate-access-token", (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  const decoded = verifyToken(refreshToken);

  if (decoded.validity) {
    const accessToken = genAccToken(
      decoded.data.id,
      decoded.data.type,
      decoded.data.email,
      decoded.data.role
    );
    res.cookie("access_token", accessToken);
    return res
      .status(RESPONSE_CODE["created"](decoded.data).code)
      .send(RESPONSE_CODE["created"](decoded.data));
  }
  return res
    .status(ERROR_CODE[decoded.data].code)
    .send(ERROR_CODE[decoded.data]);
});

module.exports = router;
