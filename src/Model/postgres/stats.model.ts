//@ts-nocheck

import Sequelize from "sequelize";
import { sequelize } from "../postgres.index";

export const Stats = sequelize.define(
  "stats",
  {
    date: {
      //format 2022-01-01 format
      type: Sequelize.STRING,
      primaryKey: true,
    },
    type: {
      //visitorCount, productClick, instaClick
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      //product id ? productId : null
      // null -> visitorCount && instaClick
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userAgent: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    count: {
      //count of each type
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["date", "type", "productId", "userAgent"], // Whatever other field you need to make unique
      },
    ],
  }
);
