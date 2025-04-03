
import { v4 as uuidv4 } from "uuid";

import { executeSQLQuery } from "../../database";

export const CreateCourse = async (
    title: string,
    category: string,
    price: number,
    description: string,
    image: string,
    tutor: string,
    date: string,
    level: string,
    duration: string,
    language: string,
    syllabus: string,
    requirements: string,
    tutor_email :string 

  ) => {
    const id = uuidv4();
    const query = `
      INSERT INTO public."courses" 
      (id, title, category, price, description, image, tutor, date, level, duration, language, syllabus, requirements,tutor_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14)
      RETURNING *;
    `;
  
    const values = [
      id,
      title,
      category,
      price,
      description,
      image,
      tutor,
      date,
      level,
      duration,
      language,
      syllabus,
      requirements,
      tutor_email 

    ];
  
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  };
  
  export const GetAllCourses = async () => {
    
      const result = await executeSQLQuery("SELECT * FROM courses");
      return result; 
    
  };