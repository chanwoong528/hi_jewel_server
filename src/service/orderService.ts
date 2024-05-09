import { ProductTypeOrder } from "../Model/postgres/product_type_order.model";
import { CustomError } from "../utils/exceptions/CustomError";
import { getProductType } from "./productService";

interface ProductTypeOrderParam {
  productTypeId: string;
  order?: number;
}

export const createProductTypeOrder = async (
  productTypeOrderParam: ProductTypeOrderParam
) => {
  try {
    const existingProductType = await getProductType(
      productTypeOrderParam.productTypeId
    );
    if (!existingProductType) {
      throw new CustomError("NotFoundError", "product type not found");
    }
    const newProductTypeOrder = await ProductTypeOrder.create({
      productTypeId: productTypeOrderParam.productTypeId,
    });
    return newProductTypeOrder.dataValues;
  } catch (error) {
    throw error;
  }
};

export const getProductTypeOrder = async (productTypeId?: string) => {
  try {
    const currentOrderType = await ProductTypeOrder.findAll({});
    return currentOrderType.map((orderType) => orderType.dataValues);
  } catch (error) {
    throw error;
  }
};

export const deleteProductTypeOrder = async (productTypeId: string) => {
  try {
    const targetDeleteProductTypeOrder = await ProductTypeOrder.destroy({
      where: { productTypeId: productTypeId },
    });
    if (targetDeleteProductTypeOrder < 1) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    return targetDeleteProductTypeOrder;
  } catch (error) {
    throw error;
  }
};
