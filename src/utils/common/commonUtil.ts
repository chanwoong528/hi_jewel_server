//@ts-nocheck

import axios from "axios";

export async function uploadImageToImgBB(req) {
  if (!req.file) {
    return "";
  }

  try {
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    const formData = new FormData();
    formData.append("image", blob, req.file.originalname);

    const uploadBB = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        params: {
          key: process.env.IMG_BB_API_KEY,
        },
      }
    );

    if (uploadBB.data.status === 200) {
      return uploadBB.data.data.display_url;
    }
    throw new CustomError("InternalServerError", "image upload failed");
  } catch (error) {
    throw error;
  }
}

export const joinTwoArray = (arr1, arr2, key1, key2) => {
  return arr1.map((item1) => {
    const item2 = arr2.find((item) => item[key1] === item1[key2]);
    return { ...item1, ...item2 };
  });
};

export const getDateRangeArray = (curDate?: string, daysInterval: number) => {
  //daysInteval represent +- days from current date
  const currentDate = curDate ? new Date(curDate) : new Date();

  const dateRange = [];

  for (let i = -daysInterval; i <= daysInterval; i++) {
    const date = new Date();
    date.setDate(currentDate.getDate() + i);
    dateRange.push(date.toISOString().split("T")[0]);
  }

  return dateRange;
};
