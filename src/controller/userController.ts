//@ts-nocheck

import {
  createUser,
  getSingleUser,
  getUserList,
  updateUser,
} from "../service/userService";
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
import { isAdmin, isLoggedIn } from "../utils/common/middleware";

const expressRouter = require("express");

const router = new expressRouter.Router();

//user get
// router.get("/:userId", () => {});
const cookieOptions = {
  expires: new Date(Date.now() + 900000),
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

https: router.get("/list", isAdmin, (req, res) => {
  getUserList()
    .then((result) => {
      return res
        .status(RESPONSE_CODE["retrieve"](result).code)
        .send(RESPONSE_CODE["retrieve"](result));
    })
    .catch((error) => {
      console.warn(error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

//user get through access token
router.get("/", isLoggedIn, (req, res) => {
  const accessToken = req.headers.authorization.split(/Bearer\s(.+)/)[1] || "";

  const decoded = verifyToken(accessToken);
  if (decoded.validity) {
    res.cookie("access_token", accessToken, cookieOptions);
    return res
      .status(RESPONSE_CODE["retrieve"](decoded.data).code)
      .send(RESPONSE_CODE["retrieve"](decoded.data));
  }
  return res
    .status(ERROR_CODE[decoded.data].code)
    .send(ERROR_CODE[decoded.data]);
});

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

//User update [self] || [admin]
router.patch("/update", isLoggedIn, (req, res) => {
  const { id, pw, type, role } = req.body;
  const accessToken = req.headers.authorization.match(/Bearer\s(.+)/)[1] || "";
  const decoded = verifyToken(accessToken);

  if (!decoded.validity) {
    // res.cookie("access_token", accessToken);
    return res
      .status(ERROR_CODE[decoded.data].code)
      .send(ERROR_CODE[decoded.data]);
  }
  if (decoded.data.role !== "admin" && id !== decoded.data.id) {
    return res
      .status(ERROR_CODE["AuthorizeLevelNotMatch"].code)
      .send(ERROR_CODE["AuthorizeLevelNotMatch"]);
  }

  const hashedPw = genPw(type, pw);
  let userParam: UserParam = {
    ...(!!pw && { pw: hashedPw }),
    ...(!!role && { role: role }),
  };

  updateUser(id, userParam)
    .then((result) => {
      return res
        .status(RESPONSE_CODE["patch"](result).code)
        .send(RESPONSE_CODE["patch"](result));
    })
    .catch((error) => {
      console.warn(error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

// User Login -> return accessToken, refreshToken
router.post("/login", (req, res) => {
  const { type, email, pw } = req.body;
  getSingleUser(undefined, type, email)
    .then(async (result) => {
      const verifyPw = await comparePw(pw, result.pw);
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
        res.cookie("access_token", accessToken, cookieOptions);
        res.cookie("refresh_token", refreshToken, cookieOptions);
        result["access_token"] = accessToken;
        result["refresh_token"] = refreshToken;
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
    res.cookie("access_token", accessToken, cookieOptions);
    return res
      .status(RESPONSE_CODE["created"](decoded.data).code)
      .send(RESPONSE_CODE["created"](decoded.data));
  }
  return res
    .status(ERROR_CODE[decoded.data].code)
    .send(ERROR_CODE[decoded.data]);
});

module.exports = router;
