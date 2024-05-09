//@ts-nocheck
const postgresDbConfig = require("../config/postgres.config");

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  postgresDbConfig.DB,
  postgresDbConfig.USER,
  postgresDbConfig.PASSWORD,
  {
    host: postgresDbConfig.HOST,
    dialect: postgresDbConfig.dialect,
    port: postgresDbConfig.PORT,
    timezone: "+09:00",
    pool: {
      max: postgresDbConfig.pool.max,
      min: postgresDbConfig.pool.min,
      acquire: postgresDbConfig.pool.acquire,
      idle: postgresDbConfig.pool.idle,
    },
  }
);

//** Model  */
const productType = require("./postgres/product_type.model");
const product = require("./postgres/product.model");
const hiJewelUser = require("./postgres/hijewel_user.model");
const post = require("./postgres/post.model");
const order = require("./postgres/product_type_order.model");

//** Model  */

export const db = {
  Sequelize: Sequelize,
  sequelize,

  productType: productType,
  product: product,
  hiJewelUser: hiJewelUser,
  post: post,
  order: order,
};

Object.keys(db).forEach((model) => {
  if ("associate" in db[model]) {
    db[model].associate(db);
  }
});


