import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { executeSQLQuery } from "../../database";
import { jwtTokens } from "../../helpers/index";

export const getUsers = async (login: string, password: string) => {
  const query = `SELECT * FROM public.users`;
  const result = await executeSQLQuery(query);
  return result.rows;
};

export const getUser = async (email: string) => {
  const query = `SELECT user_id, user_name, user_email,date_of_birth, type_register, phone_number, gender FROM public.users WHERE user_email = $1`;
  const values = [email];

  const result = await executeSQLQuery(query, values);
  return result.rows;
};

export const addUser = async (
  name: string,
  email: string,
  password: string,
  type_register: string,
  phone_number: string,
  gender: string
) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const id = uuidv4();

  const query = `
    INSERT INTO public."users"(user_id, user_name, user_email, user_password,type_register,phone_number,gender) 
    VALUES ($1, $2, $3, $4,$5,$6,$7) RETURNING *`;

  const values = [
    id,
    name,
    email,
    hashedPassword,
    type_register,
    phone_number,
    gender,
  ];

  const result = await executeSQLQuery(query, values);
  return result.rows[0];
};
export const updateUser = async (
  name: string,
  email: string,
  phone_number: string,
  gender: string,
  newEmail: string,
  date_of_birth: string
) => {
  const query = `
    UPDATE public.users 
    SET 
    user_name = $1, 
    phone_number = $2, 
    gender = $3,
    user_email=$4,
    date_of_birth=$5
    WHERE user_email=$6
    RETURNING *;
  `;

  const values = [
    name,
    phone_number,
    gender,
    newEmail,
    date_of_birth,
    email,
  ];

  const result = await executeSQLQuery(query, values);
  return result.rows[0];
};

export const deleteUser = async (email: string) => {
  const query = `
    DELETE FROM public."users" 
    WHERE user_email = $1
    RETURNING user_id, user_name, user_email;
  `;
  const result = await executeSQLQuery(query, [email]);
  if (result.rows.length == 0) {
    throw new Error(`User with username '${email}' not found.`);
  }
  return result.rows[0];
};

export const updatePassword = async (email: string, newPassword: string) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = `UPDATE public."users" SET user_password = $2 WHERE user_email = $1`;
    const result = await executeSQLQuery(query, [email, hashedPassword]);

    return result;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  const query = `SELECT user_email, user_password,type_register ,user_name FROM public."users" WHERE user_email = $1`;
  const result = await executeSQLQuery(query, [email]);
  if (result.rows.length == 0) {
    throw new Error("Invalid email or password");
  }
  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.user_password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  return result.rows[0];
};

export const checkUser = async (email: string) => {
  const query = 'SELECT user_email FROM public."users" WHERE user_email = $1';
  const result = await executeSQLQuery(query, [email]);
  if (result.rows.length > 0) {
    return true;
  }
  return false;
};

export const refreshAccessTokenService = async (req: any) => {
  const cookies = req.headers.cookie;

  const refreshToken = cookies
    .split("; ")
    .find((c: any) => c.startsWith("refresh_token="))
    ?.split("=")[1];

  if (!refreshToken)
    throw { status: 401, message: "Unauthorized - No refresh token provided" };

  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "",
      (error: any, user: any) => {
        if (error)
          return reject({
            status: 403,
            message: "Forbidden - Invalid refresh token",
          });

        const tokens = jwtTokens(user.user_id, user.user_name, user.user_email);
        resolve(tokens);
      }
    );
  });
};

export const deleteRefreshTokenService = (res: any) => {
  res.clearCookie("refresh_token");
}

