import { Sequelize } from "sequelize";
import { Product } from "../Model/postgres/product.model";
import { ProductType } from "../Model/postgres/product_type.model";
import { ProductTypeOrder } from "../Model/postgres/product_type_order.model";
import { CustomError } from "../utils/exceptions/CustomError";

export interface ProductParam {
  userId: string;
  typeId: string;
  title: string;
  description: string;
  imgSrc: string;
  isPresented: boolean;
}

export interface ProductTypeParam {
  label: string;
  description: string;
  imgSrc: string;
  isPresented: "0" | "1";
}

export const createProductType = async (productTypeParam: ProductTypeParam) => {
  try {
    const existingProductType = await ProductType.findOne({
      where: {
        label: productTypeParam.label,
      },
    });
    if (!!existingProductType) {
      throw new CustomError(
        "SequelizeUniqueConstraintError",
        "product type already exists"
      );
    }
    const newProductType = await ProductType.create({ ...productTypeParam });

    const newOrderProductType = await ProductTypeOrder.create({
      productTypeId: newProductType.dataValues.id,
    });

    return { ...newProductType.dataValues, ...newOrderProductType.dataValues };
  } catch (error) {
    throw error;
  }
};

export const getProductType = async (productTypeId?: string) => {
  try {
    if (!!productTypeId) {
      //Single ProductType get
      const productType = await ProductType.findOne({
        where: { id: productTypeId },
      });
      if (!productType) {
        throw new CustomError("NotFoundError", "result not found in database");
      }

      const productTypeOrder = await ProductTypeOrder.findOne({
        where: { productTypeId: productTypeId },
      });
      return { ...productType.dataValues, ...productTypeOrder?.dataValues };
    }
    const productTypes = await ProductType.findAll({
      include: [
        {
          model: ProductTypeOrder,
          as: "productTypeOrders",
          required: false,
          on: {
            id: Sequelize.literal(
              '"productType".id = "productTypeOrders"."productTypeId"'
            ),
          },
        },
      ],
    });

    const returnData = await productTypes
      .map((productType) => productType.dataValues)
      .map((productType) => {
        const orderDataVal = productType.productTypeOrders?.dataValues;
        return { ...productType, ...orderDataVal };
      });

    return returnData;
  } catch (error) {
    throw error;
  }
};

export const updateProductType = async (
  id: string,
  productTypeParam: ProductTypeParam
) => {
  try {
    const updateProductTypeTuples = {
      ...(!!productTypeParam.label && { label: productTypeParam.label }),
      ...(!!productTypeParam.description && {
        description: productTypeParam.description,
      }),
      ...(!!productTypeParam.imgSrc && { imgSrc: productTypeParam.imgSrc }),
      ...(!!productTypeParam.isPresented && {
        isPresented: productTypeParam.isPresented,
      }),
    };

    const updatedProductType = await ProductType.update(
      { ...updateProductTypeTuples },
      {
        where: {
          id: id,
        },
      }
    );
    if (updatedProductType[0] < 1) {
      throw new CustomError("NotFoundError", "result not found in database");
    }

    return updateProductTypeTuples;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (productParam: ProductParam) => {
  try {
    const newProduct = await Product.create({ ...productParam });
    return newProduct.dataValues;
  } catch (error) {
    throw error;
  }
};

export const getProduct = async (
  productId?: string,
  productTypeId?: string
) => {
  try {
    if (!!productId) {
      const singleProduct = await Product.findOne({
        where: { id: productId },
      });
      if (!singleProduct) {
        throw new CustomError("NotFoundError", "result not found in database");
      }
      return singleProduct.dataValues;
    }

    if (!!productTypeId) {
      const products = await Product.findAll({
        where: { typeId: productTypeId },
      });
      return products.map((product) => product.dataValues);
    }

    const products = await Product.findAll();
    return products.map((product) => product.dataValues);
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id: string, productParam: ProductParam) => {
  try {
    const updateProductTuples = {
      ...(!!productParam.title && { title: productParam.title }),
      ...(!!productParam.description && {
        description: productParam.description,
      }),
      ...(!!productParam.imgSrc && { imgSrc: productParam.imgSrc }),
      ...(!!productParam.isPresented && {
        isPresented: productParam.isPresented,
      }),
      ...(!!productParam.typeId && { typeId: productParam.typeId }),
    };

    const updatedProduct = await Product.update(
      { ...updateProductTuples },
      {
        where: {
          id: id,
        },
      }
    );
    if (updatedProduct[0] < 1) {
      throw new CustomError("NotFoundError", "result not found in database");
    }

    return updateProductTuples;
  } catch (error) {
    throw error;
  }
};
export const deleteProductType = async (id: string) => {
  try {
    const deleteProductType = await ProductType.destroy({ where: { id: id } });
    if (deleteProductType < 1) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    return deleteProductType;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const deleteProduct = await Product.destroy({ where: { id: id } });
    if (deleteProduct < 1) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    return deleteProduct;
  } catch (error) {
    throw error;
  }
};
