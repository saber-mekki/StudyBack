import { v4 as uuidv4 } from "uuid";
import { executeSQLQuery } from "../../database";

export const createBlog = async (title: string, content: string, email_user: string,user_name:string) => {
  const id = uuidv4();
  const created_at = new Date();

  const query = `
    INSERT INTO blogs (id, title, content, email_user, user_name, created_at)
    VALUES ($1, $2, $3, $4, $5,$6) RETURNING *
  `;

  const values = [id, title, content, email_user,user_name, created_at];

  const result = await executeSQLQuery(query, values);

  return result.rows[0];
};



export const GetAllBlogs = async () => {
  const query = `SELECT * FROM blogs`;
  const result = await executeSQLQuery(query); 

  return result.rows;  
};
export const GetBlogById = async (id: number) => {
    const query = `SELECT * FROM blogs WHERE id = $1`;
    const values = [id];
    const result = await executeSQLQuery(query, values);
  
    return result.rows[0]; 
  };
  