//@ts-nocheck

import {
  createProduct,
  createProductType,
  getProduct,
  getProductType,
  updateProductType,
} from "../service/productService";
import RESPONSE_CODE from "../utils/CONSTANT/RESPONSE_CODE";
import ERROR_CODE from "../utils/CONSTANT/ERROR_CODE";
import { isAdmin, isLoggedIn } from "../utils/common/middleware";
import axios from "axios";
import { verifyToken } from "../utils/common/authUtil";

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const expressRouter = require("express");

const router = new expressRouter.Router();

// getAll product type
router.get("/type", (req, res) => {
  getProductType()
    .then((result) => {
      return res
        .status(RESPONSE_CODE["retrieve"](result).code)
        .send(RESPONSE_CODE["retrieve"](result));
    })
    .catch((error) => {
      console.warn("error in getall product", error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

// create product type
router.post("/type", isAdmin, (req, res) => {
  const { label, description } = req.body;
  createProductType({ label, description })
    .then((result) => {
      return res
        .status(RESPONSE_CODE["created"](result).code)
        .send(RESPONSE_CODE["created"](result));
    })
    .catch((error) => {
      console.warn("error in createProductType", error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});
//update product type
//patch:=>  자원의 부분 교체, 자원교체시 일부 필드 필요
router.patch("/type/:id", isAdmin, async (req, res) => {
  const { label, description } = req.body;
  try {
    const targetProductType = await getProductType(req.params.id);
    if (!targetProductType) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    const result = await updateProductType(targetProductType.id, {
      label,
      description,
    });
    return res
      .status(RESPONSE_CODE["patch"](result).code)
      .send(RESPONSE_CODE["patch"](result));
  } catch (error) {
    console.warn("error in update productType", error);
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

router.get("/:id", (req, res) => {
  getProduct(req.params.id)
    .then((result) => {
      return res
        .status(RESPONSE_CODE["retrieve"](result).code)
        .send(RESPONSE_CODE["retrieve"](result));
    })
    .catch((error) => {
      console.warn("error in getall product", error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

router.get("/", (req, res) => {
  getProduct()
    .then((result) => {
      return res
        .status(RESPONSE_CODE["retrieve"](result).code)
        .send(RESPONSE_CODE["retrieve"](result));
    })
    .catch((error) => {
      console.warn("error in getall product", error);
      return res
        .status(ERROR_CODE[error.name].code)
        .send(ERROR_CODE[error.name]);
    });
});

//create product
router.post("/", upload.single("image"), isAdmin, async (req, res) => {
  const { title, description, typeId } = req.body;
  const verifyUser = verifyToken(req.cookies.access_token);

  try {
    const productType = await getProductType(typeId);

    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    const formData = new FormData();
    formData.append("image", blob, req.file.originalname);

    axios
      .post("https://api.imgbb.com/1/upload", formData, {
        params: {
          key: process.env.IMG_BB_API_KEY,
        },
      })
      .then((result) => {
        if (result.status === 200) {
          createProduct({
            typeId: productType.id,
            userId: verifyUser.data.id,
            title: title,
            description: description,
            imgSrc: result.data.data.display_url,
          }).then((result) => {
            return res
              .status(RESPONSE_CODE["created"](result).code)
              .send(RESPONSE_CODE["created"](result));
          });
        } else {
          throw new CustomError("InternalServerError", "image upload failed");
        }
      });
  } catch (error) {
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

module.exports = router;
