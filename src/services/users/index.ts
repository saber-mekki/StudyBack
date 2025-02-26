import { executeSQLQuery } from "../../database";
import jwt from 'jsonwebtoken'; 
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { jwtTokens } from '../../helpers/index';


export const getUsers = async (login: string, password: string) => {
    const query = `SELECT * FROM public.users`;
    const result = await executeSQLQuery(query);
    return result.rows;
};

export const getUser = async (login: string, password: string) => {
    const query = `SELECT * FROM public."userTable" WHERE login='${login}'`;
    
    const result = await executeSQLQuery(query);
    return result.rows;
};

export const addUser = async (name: string, email: string, password: string ,type_register:string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const id = uuidv4();

  const query = `
    INSERT INTO public."users"(user_id, user_name, user_email, user_password,type_register) 
    VALUES ($1, $2, $3, $4,$5) RETURNING *`;
  
  const values = [id, name, email, hashedPassword,type_register];

  const result = await executeSQLQuery(query, values);
  return result.rows[0];
};

export const deleteUser = async (email: string) => {
    const query = `
    DELETE FROM public."users" 
    WHERE user_email = $1
    RETURNING user_id, user_name, user_email;
  `;
    const result = await executeSQLQuery(query,[email]);
    if(result.rows.length==0){
        throw new Error(`User with username '${email}' not found.`);


    }
    return result.rows[0];
};


export const loginUser = async(email:string,password:string) =>{
    const query = `SELECT user_email, user_password,type_register FROM public."users" WHERE user_email = $1`;
    const result=await executeSQLQuery(query,[email])
    if(result.rows.length==0){
        throw new Error("Invalid email or password");

    }
    const user=result.rows[0];
    
    const isMatch=await bcrypt.compare(password,user.user_password) 
    if(!isMatch){
        throw new Error("Invalid password");

    }
   
     
      return  result.rows[0];

}
export const checkUser =async(email:string)=>{

  const query = 'SELECT user_email FROM public."users" WHERE user_email = $1';
  const result = await executeSQLQuery(query, [email]);
  
  if (result.rows.length > 0) {
      return true;  // Email exists
  }
  return false;  // Email does not exist
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
