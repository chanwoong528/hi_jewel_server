import { Post } from "../Model/postgres/post.model";
import { CustomError } from "../utils/exceptions/CustomError";
import { sequelize } from "../Model/postgres.index";
import { Op } from "sequelize";

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
      title: postParam.title ? postParam.title : "TypeComment",
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
      const post = await Post.findAll({
        where: {
          [Op.or]: [{ id: postId }, { parentPostId: postId }],
        },
        order: [["type", "ASC"]],
      });

      if (!post) {
        throw new CustomError("NotFoundError", "result not found in database");
      }
      const result = {
        post: await post.find((item) => item.dataValues.id === postId)
          ?.dataValues,
        comments: await post.map((post) => post.dataValues),
      };
      // console.log(result);

      return result;
    }
    if (getType === "user") {
      const noticePosts = (
        await Post.findAll({
          where: { type: "0", isPresented: "1" },
          limit: 5,
          order: [["createdAt", "DESC"]],
        })
      ).map((post) => post.dataValues);

      const qnaPosts = (
        await Post.findAll({
          where: { type: "1", isPresented: "1" },
          order: [["createdAt", "DESC"]],
        })
      ).map((post) => post.dataValues);
      //       const postsForUsers = await sequelize.query(`
      //       SELECT *
      //       FROM (
      //           SELECT *,
      //                 ROW_NUMBER() OVER (PARTITION BY type ORDER BY "createdAt" ) AS row_num
      //           FROM posts
      //       ) AS ranked_data
      //       WHERE  "isPresented" ='1' and (type = '0' or (type = '1' AND row_num <= 5))
      //       order by  type desc;
      //       `);
      //       const postForUserData = await postsForUsers[0];
      const result = [...noticePosts, ...qnaPosts];
      return result;
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
      ...(!!postParam.title && { title: postParam.title }),
      ...(!!postParam.content && {
        content: postParam.content,
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
  } catch (error) {
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    const deletePost = await Post.destroy({
      where: {
        id: id,
      },
    });
    const deletePostComment = await Post.destroy({
      where: {
        parentPostId: id,
      },
    });
    if (deletePost < 1) {
      throw new CustomError("NotFoundError", "result not found in database");
    }
    return deletePost;

    // const deletedPostResp = await deletePost.
  } catch (error) {
    throw error;
  }
};
