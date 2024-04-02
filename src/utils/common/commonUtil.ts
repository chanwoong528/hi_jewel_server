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
