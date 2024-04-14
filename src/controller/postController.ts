//@ts-nocheck

import RESPONSE_CODE from "../utils/CONSTANT/RESPONSE_CODE";
import ERROR_CODE from "../utils/CONSTANT/ERROR_CODE";
import { createPost, getPost, updatePost } from "../service/postService";
import { isLoggedIn } from "../utils/common/middleware";

const expressRouter = require("express");

const router = new expressRouter.Router();

router.get("/", (req, res) => {
  let { postId, getType } = req.query;

  getPost(postId ? postId : undefined, getType ? getType : undefined)
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

router.patch("/:id", async (req, res) => {
  const { title, content, type, isPresented } = req.body;
  const { id } = req.params;
  try {
    const targetPost = await getPost(id);
    if (!targetPost) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    const updatedPost = await updatePost(id, {
      title,
      content,
      type,
      isPresented,
    });
    return res
      .status(RESPONSE_CODE["patch"](updatedPost).code)
      .send(RESPONSE_CODE["patch"](updatedPost));
  } catch (error) {
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

module.exports = router;
