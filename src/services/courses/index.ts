

import { executeSQLQuery } from "../../database";

export const CreateCourse = async (
  id:string,
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

  export const CreatePDF = async (courseId: number, pdfUrl: string) => {

    const query = `
      INSERT INTO course_pdfs (course_id, pdf_url)
      VALUES ($1, $2)
      RETURNING id, course_id, pdf_url;
    `;
    const values = [courseId, pdfUrl];
  
    const result =await executeSQLQuery(query,values)
    return result.rows[0];
  };
  