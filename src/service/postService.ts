import { Post } from "../Model/postgres/post.model";
import { CustomError } from "../utils/exceptions/CustomError";

interface PostParam {
  title: string;
  content: string;
  postPw: string;
  userEmail: string;
  type: string;
  parentPostId: string | undefined | null;
  isPresented: string;
}

export const createPost = async (postParam: PostParam) => {
  try {
    const newPost = await Post.create({
      ...postParam,
      postPw: postParam.postPw ? postParam.postPw : "1234",
    });
    return newPost.dataValues;
  } catch (error) {
    throw error;
  }
};

export const getPost = async (postId?: string) => {
  try {
    if (!!postId) {
      const post = await Post.findOne({
        where: { id: postId },
      });
      if (!post) {
        throw new CustomError("NotFoundError", "result not found in database");
      }
      return post.dataValues;
    }

    const posts = await Post.findAll();
    return posts.map((post) => post.dataValues);
  } catch (error) {
    throw error;
  }
};
