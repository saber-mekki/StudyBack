import { v4 as uuidv4 } from 'uuid';

import { executeSQLQuery } from "../../database";

export const CreateCourse = async (
  id:string,
  tutor_id:string,
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
      (id,tutor_id, title, category, price, description, image, tutor, date, level, duration, language, syllabus, requirements,tutor_email)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14,$15)
      RETURNING *;
    `;
  
    const values = [
      id,
      tutor_id,
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
  
  export const AddCourseVideo = async (
    courseId: string,
    file: string,
    description: string
  ) => {
    const query = `
      INSERT INTO public."course_videos" 
      (id, course_id, file, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
  
    const values = [
      uuidv4(),
      courseId,
      file,
      description,
    ];
  
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  };

  export const AddCoursePdf = async (
    courseId: string,
    file: string,
    description: string
  ) => {
    const query = `
      INSERT INTO public."course_pdfs" 
      (id, course_id, file, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
  
    const values = [
      uuidv4(),
      courseId,
      file,
      description,
    ];
  
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  };

  export const GetCourseById = async (id: string) => {
    const result = await executeSQLQuery('SELECT * FROM courses WHERE id = $1', [id]);
    return result.rows[0]; 
  };

  export const GetCourseVideos = async (courseId: string) => {
    const result = await executeSQLQuery(
      `SELECT file, description FROM course_videos WHERE course_id = $1`,
      [courseId]
    );
    return result.rows;
  };
  
  export const GetCoursePdfs = async (courseId: string) => {
    const result = await executeSQLQuery(
      `SELECT file, description FROM course_pdfs WHERE course_id = $1`,
      [courseId]
    );
    return result.rows;
  };



export const getCoursesByUserId = async (userId:string) => {
  const result = await executeSQLQuery(
    "SELECT * FROM courses WHERE tutor_id = $1",
    [userId]
  );
  return result.rows;
};

