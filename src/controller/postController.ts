//@ts-nocheck

import RESPONSE_CODE from "../utils/CONSTANT/RESPONSE_CODE";
import ERROR_CODE from "../utils/CONSTANT/ERROR_CODE";
import { createPost, getPost } from "../service/postService";

const expressRouter = require("express");

const router = new expressRouter.Router();

router.get("/", (req, res) => {
  let { postId } = req.query;

  getPost(postId ? postId : undefined)
    .then((result) => {
      return res
        .status(RESPONSE_CODE["retrieve"](result).code)
        .send(RESPONSE_CODE["retrieve"](result));
    })
    .catch((error) => {
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

router.post("/", (req, res) => {
  console.log(req.body);
  createPost(req.body)
    .then((result) => {
      return res
        .status(RESPONSE_CODE["created"](result).code)
        .send(RESPONSE_CODE["created"](result));
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

router.patch("/", (req, res) => {});

module.exports = router;
