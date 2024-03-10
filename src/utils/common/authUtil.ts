//@ts-nocheck
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const genPw = (loginType: string, pw: string) => {
  if (loginType === "email") {
    return bcrypt.hashSync(pw, Number(process.env.BCRYPT_SALT_ROUND));
  }
  return `snsSignInPw:${loginType}`;
};

export const comparePw = async (pw: string, hashedPw: string) => {
  const match = await bcrypt.compare(pw, hashedPw);
  if (match) {
    return true;
  }
  return false;
};

export const genRefToken = (
  id: string,
  loginType: string,
  email: string,
  role: string
) => {
  const refreshToken = jwt.sign(
    { id, type: loginType, email, role },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 60 * 24 }
    // { expiresIn: 1 }
  );
  return refreshToken;
};

export const genAccToken = (
  id: string,
  loginType: string,
  email: string,
  role: string
) => {
  const accessToken = jwt.sign(
    { id, type: loginType, email, role },
    process.env.JWT_SECRET,
    { expiresIn: 60 * 15 }
    // { expiresIn: 1 * 10 }
  );
  return accessToken;
};

export const verifyToken = (token: string) => {
  const decodedJWT = jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        //TokenExpiredError
        //JsonWebTokenError
        return { validity: false, data: err.name };
      }
      return { validity: true, data: decoded };
    }
  );
  return decodedJWT;
};
