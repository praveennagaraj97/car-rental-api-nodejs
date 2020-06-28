import { sign, verify } from "jsonwebtoken";
import { promisify } from "util";

const jwtSignPromise = promisify(sign);
const jwtVerifyPromise = promisify(verify);

export const JWTTokenGen = (id, ...expiresInOption) => {
  return jwtSignPromise({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: expiresInOption[0] || process.env.JWT_EXPIRES,
  });
};

export const JWTTokenVerify = (token) => {
  return jwtVerifyPromise(token, process.env.JWT_SECRET_KEY);
};

export const JWTTimeStampCheck = (iat, exp) => {
  return new Promise((resolve, reject) => {
    iat < exp ? resolve(true) : reject(false);
  });
};
