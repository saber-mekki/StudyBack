import { executeSQLQuery } from "../../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtTokens } from '../../helpers/index';


export const getUsers = async (login: string, password: string) => {
    const query = `SELECT * FROM public.users`;
    const result = await executeSQLQuery(query);
    return result.rows;
};

export const addUser = async (name: string, password: string, email : string,	registerType: string) => {
      const saltRounds = 10; 
	  const hashedPassword = await bcrypt.hash(password, saltRounds);
      const checkQuery = `SELECT user_email FROM public.users WHERE user_email = '${email}'`;
      const existingUser = await executeSQLQuery(checkQuery);
      if (existingUser.rows.length > 0) {
        throw new Error("Email already exists. Please use a different email.");
      }
      
	  const query = `INSERT INTO public.users (user_name,user_email,user_password) VALUES ('${name}','${email}','${hashedPassword}')`;
      const result = await executeSQLQuery(query);
	  return result.rows[0];
};


export const login = async (email: string, password: string) => {
    const users = `SELECT * FROM users WHERE user_email= '${email}'`;
      const existingUsers = await executeSQLQuery(users);
      if (existingUsers.rows.length === 0) throw new Error("Email is incorrect");
       const validPassword = await bcrypt.compare(password, existingUsers.rows[0].user_password);
       if (!validPassword) throw new Error("Incorrect password");
        return existingUsers.rows[0]
     

};

export const deleteUser = async (login: string) => {
    const query = `DELETE  FROM public.userDB WHERE login='${login}' returning login`;
    const result = await executeSQLQuery(query);
    return result.rows[0];
};


export const refreshAccessTokenService = async (req: any) => {
  const cookies = req.headers.cookie;
 
  const refreshToken = cookies
  .split("; ")
  .find((c:any) => c.startsWith("refresh_token="))
  ?.split("=")[1];


  if (!refreshToken) throw { status: 401, message: "Unauthorized - No refresh token provided" };

  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "", (error: any, user: any) => {
      if (error) return reject({ status: 403, message: "Forbidden - Invalid refresh token" });

      const tokens = jwtTokens( user.user_id, user.user_name, user.user_email);
      resolve(tokens);
    });
  });
};

export const deleteRefreshTokenService = (res: any) => {
  res.clearCookie("refresh_token");
};
