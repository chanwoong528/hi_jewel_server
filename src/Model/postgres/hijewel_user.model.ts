//@ts-nocheck
import Sequelize from "sequelize";
import { sequelize } from "../postgres.index";

export const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    type: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    pw: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
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
        fields: ["email", "type"], // Whatever other field you need to make unique
      },
    ],
  }
);
