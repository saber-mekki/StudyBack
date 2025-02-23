import { executeSQLQuery } from "../../database";
import jwt from 'jsonwebtoken'; 
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";


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

export const addUser = async (name: string, email: string, password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const id = uuidv4();

  const query = `
    INSERT INTO public."users"(user_id, user_name, user_email, user_password) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
  
  const values = [id, name, email, hashedPassword];

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
    const query = `SELECT user_email, user_password FROM public."users" WHERE user_email = $1`;
    const result=await executeSQLQuery(query,[email])
    if(result.rows[0]==0){
        throw new Error("Invalid email or password");

    }
    const user=result.rows[0];
    
    const isMatch=await bcrypt.compare(password,user.user_password) 
    if(!isMatch){
        throw new Error("Invalid password");

    }
    const token = jwt.sign(
        {  email: user.user_email },
        process.env.JWT_SECRET as string,
            { expiresIn: "1h" } 
        );
     
      return {  token  };

}