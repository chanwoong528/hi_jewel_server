import { Product } from "../Model/postgres/product.model";
import { ProductType } from "../Model/postgres/product_type.model";
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
    return newProductType.dataValues;
  } catch (error) {
    throw error;
  }
};

export const getProductType = async (productTypeId?: string) => {
  try {
    if (!!productTypeId) {
      const productType = await ProductType.findOne({
        where: { id: productTypeId },
      });
      if (!productType) {
        throw new CustomError("NotFoundError", "result not found in database");
      }
      return productType.dataValues;
    }

    const productTypes = await ProductType.findAll();
    return productTypes.map((productType) => productType.dataValues);
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

export const getProduct = async (productId?: string) => {
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
