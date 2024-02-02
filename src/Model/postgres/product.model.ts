//@ts-nocheck
import Sequelize from "sequelize";
import { sequelize } from "../postgres.index";

export const Product = sequelize.define(
  "product",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    typeId: {
      type: Sequelize.UUID,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: Sequelize.UUID,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    title: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imgSrc: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["id"], // Whatever other field you need to make unique
      },
    ],
  }
);
