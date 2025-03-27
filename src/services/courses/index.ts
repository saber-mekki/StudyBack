
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
    requirements: string
  ) => {
    const id = uuidv4();
    const query = `
      INSERT INTO public."courses" 
      (id, title, category, price, description, image, tutor, date, level, duration, language, syllabus, requirements)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
      requirements
    ];
  
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  };
  
  export const GetAllCourses = async () => {
    
      const result = await executeSQLQuery("SELECT * FROM courses");
      return result; 
    
  };