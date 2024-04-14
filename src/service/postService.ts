import { Post } from "../Model/postgres/post.model";
import { CustomError } from "../utils/exceptions/CustomError";
import { sequelize } from "../Model/postgres.index";

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

export const getPost = async (postId?: string, getType?: string) => {
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
    if (getType === "user") {
      const postsForUsers = await sequelize.query(`
      SELECT *
      FROM (
          SELECT *,
                ROW_NUMBER() OVER (PARTITION BY type ORDER BY "createdAt") AS row_num
          FROM posts
      ) AS ranked_data
      WHERE  "isPresented" ='1' and ( type = '0' OR (type = '1' AND row_num <= 5));
      `);
      const postForUserData = await postsForUsers[0];
      return postForUserData;
    }

    const posts = await Post.findAll();
    return posts.map((post) => post.dataValues);
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (id: string, postParam: PostParam) => {
  try {
    const updatePostTuples = {
      ...(!!postParam.title && { label: postParam.title }),
      ...(!!postParam.content && {
        description: postParam.content,
      }),
      ...(!!postParam.isPresented && {
        isPresented: postParam.isPresented,
      }),
    };

    const updatedPost = await Post.update(
      {
        ...updatePostTuples,
      },
      {
        where: {
          id,
        },
      }
    );
    if (updatedPost[0] < 1) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    return updatePostTuples;
  } catch (error) {}
};
