import { Sequelize } from "sequelize";
import { Stats } from "../Model/postgres/stats.model";
import { GetStatType } from "../controller/statsController";
import { Op } from "sequelize";
import { get } from "http";
import { CustomError } from "../utils/exceptions/CustomError";
import { getDateRangeArray } from "../utils/common/commonUtil";

interface StatParam {
  date: string; //key
  type: "visitorCount" | "productClick" | "instaClick"; //key
  productId: string; //key
  userAgent: string;
}

export const upsertStat = async (statParam: StatParam) => {
  try {
    const userAgent = statParam.userAgent ? statParam.userAgent : "unknown";

    const targetData = await Stats.findOne({
      where: {
        date: statParam.date,
        type: statParam.type,
        productId: statParam.productId,
        userAgent,
      },
    });
    if (!targetData) {
      //insert
      const newStat = await Stats.upsert({
        date: statParam.date,
        type: statParam.type,
        productId: statParam.productId,
        userAgent,
      });
      return newStat[0].dataValues;
    } else {
      const incrementCount = await Stats.increment("count", {
        by: 1,
        where: {
          date: statParam.date,
          type: statParam.type,
          productId: statParam.productId,
          userAgent,
        },
      });
      return incrementCount;
    }
  } catch (error) {
    throw error;
  }
};

export const getStatsByType = async (type: GetStatType, curDate?: string) => {
  try {
    switch (type) {
      case GetStatType.viewsByDateArr:
        const dateArrRange = getDateRangeArray(curDate, 2);
        const viewsByDateFiveData = await Stats.findAll({
          where: {
            productId: "noId",
            date: {
              [Op.in]: [...dateArrRange], // IN condition for the date
            },
          },
        });
        return viewsByDateFiveData.map((data) => data.dataValues);

      case GetStatType.totalProductCount:
        const resultData = await Stats.findAll({
          attributes: [
            "productId",
            [Sequelize.fn("sum", Sequelize.col("count")), "total"],
          ],
          where: {
            productId: {
              [Op.ne]: "noId", // Op.ne corresponds to SQL's '!='
            },
          },
          group: "productId",
        });
        return resultData.map((data) => data.dataValues);

      default:
        return;
    }
  } catch (error) {
    throw error;
  }
};
