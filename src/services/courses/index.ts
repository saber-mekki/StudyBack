import { v4 as uuidv4 } from 'uuid';
import AWS from "aws-sdk";
import { executeSQLQuery } from "../../database";
import { URL } from 'url';

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

  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    region: process.env.AWS_REGION!,
  });
  
  export const getSignedUrlForPDF = (key: string) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_PRIVATE!,
      Key: key,
      Expires: 60 * 5 
    };
    return s3.getSignedUrl('getObject', params);
  };

  export const GetCourseVideos = async (courseId: string) => {
    
    const result = await executeSQLQuery(
      `SELECT file, description FROM course_videos WHERE course_id = $1`,
      [courseId]
    );
    
        return result.rows.map((row: any) => {
          const url = new URL(row.file);
          const key = decodeURIComponent(url.pathname.slice(1)); 
          return {
            ...row,
            signed_url: getSignedUrlForPDF(key)
          };
        });
  };
  
  export const GetCoursePdfs = async (courseId: string) => {
    const result = await executeSQLQuery(
      `SELECT file, description FROM course_pdfs WHERE course_id = $1`,
      [courseId]
    );
   
    return result.rows.map((row: any) => {
      const url = new URL(row.file);
      const key = decodeURIComponent(url.pathname.slice(1)); 
      return {
        ...row,
        signed_url: getSignedUrlForPDF(key)
      };
    });
  };



export const getCoursesByUserId = async (userId:any) => {
  const result = await executeSQLQuery(
    "SELECT * FROM courses WHERE tutor_id = $1",
    [userId]
  );
  return result.rows;
};

export async function addOrUpdateRatingS(
  userId: any,
  courseId: any,
  rating: number,
  comment: string
){
  // Check if user purchased this course
  const purchase = await executeSQLQuery(
    "SELECT * FROM course_purchases WHERE student_id=$1 AND course_id=$2",
    [userId, courseId]
  );

  if (purchase.rows.length === 0) {
    throw new Error("You must purchase the course before rating it.");
  }

  const result = await executeSQLQuery(
    `INSERT INTO cours_ratings (user_id, course_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, course_id)
     DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment
     RETURNING *`,
    [userId, courseId, rating, comment]
  );

  return result.rows[0];
}

// ✅ Get all ratings for a course
export async function getCourseRatingsS(
  courseId: any
){
  const ratings = await executeSQLQuery(
    `SELECT r.id, r.user_id, r.course_id, r.rating, r.comment, r.created_at, u.user_name
     FROM cours_ratings r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.course_id=$1
     ORDER BY r.created_at DESC`,
    [courseId]
  );

  const avg = await executeSQLQuery(
    "SELECT COALESCE(AVG(rating),0) as average FROM cours_ratings WHERE course_id=$1",
    [courseId]
  );

  return {
    ratings: ratings.rows,
    averageRating: Number(avg.rows[0].average),
  };
}

// ✅ Get all ratings of a user
export async function getUserRatingsS(userId: any){
  const result = await executeSQLQuery(
    `SELECT r.id, r.user_id, r.course_id, r.rating, r.comment, r.created_at, c.title as course_title
     FROM cours_ratings r
     JOIN courses c ON r.course_id = c.id
     WHERE r.user_id=$1`,
    [userId]
  );
  return result.rows;
}


export const GetRelatedCourses = async (courseId: string, category: string) => {
  const query = `
    SELECT * 
    FROM courses 
    WHERE category = $1 AND id != $2
    LIMIT 5;
  `;
  const result = await executeSQLQuery(query, [category, courseId]);
  return result.rows;
};