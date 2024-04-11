//@ts-nocheck
import Sequelize from "sequelize";
import { sequelize } from "../postgres.index";

export const Post = sequelize.define(
  "post",
  {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content: {
      //html
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    postPw: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userEmail: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    type: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      defaultValue: 0, //0:qna, 1:notice, 2:comment
      validate: {
        notEmpty: true,
      },
    },
    parentPostId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isPresented: {
      type: Sequelize.STRING,
      require: true,
      allowNull: false,
      defaultValue: 0,
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
