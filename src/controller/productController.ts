//@ts-nocheck
import axios from "axios";
import { CustomError } from "../utils/exceptions/CustomError";
import {
  createProduct,
  createProductType,
  deleteProduct,
  deleteProductType,
  getProduct,
  getProductType,
  updateProduct,
  updateProductType,
} from "../service/productService";
import RESPONSE_CODE from "../utils/CONSTANT/RESPONSE_CODE";
import ERROR_CODE from "../utils/CONSTANT/ERROR_CODE";
import { isAdmin } from "../utils/common/middleware";
import { verifyToken } from "../utils/common/authUtil";
import { uploadImageToImgBB } from "../utils/common/commonUtil";

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
router.post("/type", upload.single("image"), isAdmin, (req, res) => {
  const { label, description } = req.body;
  try {
    uploadImageToImgBB(req).then((dataUrl) => {
      createProductType({
        label,
        description,
        imgSrc: dataUrl,
      }).then((result) => {
        return res
          .status(RESPONSE_CODE["created"](result).code)
          .send(RESPONSE_CODE["created"](result));
      });
    });
  } catch (error) {
    console.warn("error", error);
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});
//update product type
//patch:=>  자원의 부분 교체, 자원교체시 일부 필드 필요
router.patch("/type/:id", upload.single("image"), isAdmin, async (req, res) => {
  const { label, description, isPresented } = req.body;
  try {
    const targetProductType = await getProductType(req.params.id);
    if (!targetProductType) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    const editImgUrl = await uploadImageToImgBB(req);
    const result = await updateProductType(targetProductType.id, {
      label,
      description,
      isPresented,
      imgSrc: editImgUrl,
    });

    return res
      .status(RESPONSE_CODE["patch"](result).code)
      .send(RESPONSE_CODE["patch"](result));
  } catch (error) {
    console.warn("error in update productType", error);
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

//Product [TYPE] Delete
router.delete("/type/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const productsById = await getProduct(undefined, id);

    if (productsById.length > 0) {
      throw new CustomError("ChildExist", "result not found in database");
    }
    const targetDeleteProductTypeItem = await deleteProductType(id);

    if (targetDeleteProductTypeItem > 0) {
      return res
        .status(RESPONSE_CODE["delete"]().code)
        .send(RESPONSE_CODE["delete"]());
    }

    return res
      .status(RESPONSE_CODE["delete"]().code)
      .send(RESPONSE_CODE["delete"]());
  } catch (error) {
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
  const verifyUser = verifyToken(
    req.headers.authorization.match(/Bearer\s(.+)/)[1]
  );

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

//update product
//patch:=>  자원의 부분 교체, 자원교체시 일부 필드 필요
router.patch("/:id", upload.single("image"), isAdmin, async (req, res) => {
  const { title, description, typeId, isPresented } = req.body;
  try {
    const targetProduct = await getProduct(req.params.id);
    if (!targetProduct) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    const editImgUrl = await uploadImageToImgBB(req);
    const result = await updateProduct(targetProduct.id, {
      title,
      description,
      typeId,
      isPresented,
      imgSrc: editImgUrl,
    });

    return res
      .status(RESPONSE_CODE["patch"](result).code)
      .send(RESPONSE_CODE["patch"](result));
  } catch (error) {
    console.warn("error in update productType", error);
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

//Product Delete
router.delete("/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const targetProduct = await getProduct(id);
    if (!targetProduct) {
      throw new CustomError("NotFoundError", "result not found in database");
    }

    const targetDeleteProduct = await deleteProduct(id);
    if (targetDeleteProduct > 0) {
      return res
        .status(RESPONSE_CODE["delete"]().code)
        .send(RESPONSE_CODE["delete"]());
    }

    return res
      .status(RESPONSE_CODE["delete"]().code)
      .send(RESPONSE_CODE["delete"]());
  } catch (error) {
    return res.status(ERROR_CODE[error.name].code).send(ERROR_CODE[error.name]);
  }
});

module.exports = router;
