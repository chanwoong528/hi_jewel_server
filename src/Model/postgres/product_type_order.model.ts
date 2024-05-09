import Sequelize from "sequelize";
import { sequelize } from "../postgres.index";
export const ProductTypeOrder = sequelize.define(
  "productTypeOrder",
  {
    productTypeId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
  },

  {
    indexes: [
      {
        unique: true,
        fields: ["productTypeId", "order"], // Whatever other field you need to make unique
      },
    ],
  }
);
