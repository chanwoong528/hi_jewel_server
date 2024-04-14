import { User } from "../Model/postgres/hijewel_user.model";
import { CustomError } from "../utils/exceptions/CustomError";

export interface UserParam {
  email: string;
  type: "email" | "google" | "kakao" | "naver";
  pw: string;
  role: "user" | "admin";
}

export const createUser = async (userParam: UserParam) => {
  try {
    const existingUser = await User.findOne({
      where: {
        email: userParam.email,
        type: userParam.type,
      },
    });
    if (!!existingUser) {
      delete existingUser.dataValues["pw"];

      return existingUser.dataValues;
    }

    if (!userParam.role) userParam.role = "user";

    const newUser = await User.create({
      ...userParam,
      attributes: { exclude: ["pw"] },
    });

    delete newUser.dataValues["pw"];
    return newUser.dataValues;
  } catch (error) {
    throw error;
  }
};

export const getUserList = async () => {
  try {
    const userList = await User.findAll({
      attributes: { exclude: ["pw"] },
    });

    const returnUserList = await userList.map((user) => user.dataValues);
    return returnUserList;
  } catch (error) {
    throw error;
  }
};

export const getSingleUser = async (
  userId?: string,
  type?: string,
  email?: string
) => {
  try {
    let targetUser;

    if (!!userId) {
      targetUser = await User.findOne({ where: { id: userId } });
    } else if (!!type && !!email) {
      targetUser = await User.findOne({ where: { email, type } });
    }

    if (!targetUser) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    return targetUser.dataValues;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (userId: string, userParam: UserParam) => {
  try {
    //TODO::
    const updatedUser = await User.update(
      {
        ...(!!userParam.pw && { pw: userParam.pw }),
        ...(!!userParam.role && { role: userParam.role }),
      },
      {
        where: {
          id: userId,
        },
      }
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
};
