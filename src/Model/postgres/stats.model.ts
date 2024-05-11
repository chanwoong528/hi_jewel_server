//@ts-nocheck

import Sequelize from "sequelize";
import { sequelize } from "../postgres.index";

export const Stats = sequelize.define("stats", {
  date: {
    //format 2022-01-01 format
    type: Sequelize.STRING,
    primaryKey: true,
  },
  type: {
    //visitorCount, productClick, instaClick
    type: Sequelize.STRING,
    allowNull: false,
  },
  productId: {
    //product id ? productId : null
    // null -> visitorCount && instaClick
    type: Sequelize.UUID,
    allowNull: true,
  },
  count: {
    //count of each type
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
});
