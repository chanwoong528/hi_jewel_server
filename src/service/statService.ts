import { Stats } from "../Model/postgres/stats.model";

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
      const newStat = await Stats.create({
        date: statParam.date,
        type: statParam.type,
        productId: statParam.productId,
        userAgent,
      });
      return newStat.dataValues;
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



export const getStatsByType = ()=>{}


