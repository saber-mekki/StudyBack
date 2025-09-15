import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";
import { executeSQLQuery } from "../../database";
import { jwtTokens } from "../../helpers/index";
import { URL } from "url";

export const getUsers = async () => {
  const query = `
    SELECT u.*, t.country, t.price_per_hour, t.specialty, t.degree, t.languages, t.availability, t.rating ,t.is_active,t.cover_letter
    FROM public.users u
    LEFT JOIN public.tutors t ON u.user_email = t.tutor_email
    WHERE u.type_register = 'tutor' OR u.type_register != 'tutor'
  `;

  try {
    const result = await executeSQLQuery(query);
    return result.rows;
  } catch (error) {
    throw new Error('Error fetching users: ' + error);
  }
};


export const getUser = async (email: string) => {
  const query = `SELECT * FROM public.users WHERE user_email = $1`;
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
  date_of_birth: string,
  idUser:any
) => {

  const query = `
    UPDATE public.users 
    SET 
    user_name = $1, 
    phone_number = $2, 
    gender = $3,
    date_of_birth=$4
    WHERE user_id=$5
    RETURNING *;
  `;

  const values = [
    name,
    phone_number,
    gender,
    date_of_birth,
    idUser
  ];

  const result = await executeSQLQuery(query, values);
  
  return result.rows[0];
};

export const deleteUser = async (id: string) => {
  const query = `
    DELETE FROM public.users
    WHERE user_id = $1
    RETURNING user_id, user_name, user_email;
  `;
  const result = await executeSQLQuery(query, [id]);
  if (result.rows.length == 0) {
    throw new Error(`User with username '${id}' not found.`);
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
  const query = `SELECT user_id ,user_email, user_password,type_register ,user_name , is_verified FROM public."users" WHERE user_email = $1`;
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

export const addTutor = async (
  tutor_email: string,
  country: string,
  price_per_hour: number,
  specialty: string,
  degree: string,
  languages: string[],
  availability: string
  ,cover_letter: string 
) => {
  try {
    const query = `
      INSERT INTO tutors (tutor_email, country, price_per_hour, specialty, degree, languages, availability,cover_letter)
      VALUES ($1, $2, $3, $4, $5, $6, $7,$8)
    `;

    const result = await executeSQLQuery(query, [
      tutor_email,
      country,
      price_per_hour,
      specialty,
      degree,
      languages,
      availability,
      cover_letter
    ]);

    return result;
  } catch (error) {
    console.error('Error adding tutor:', error);
    throw error;
  }
};

export const updateUserDetails = async (email: string, bio: string, photo: string) => {
  const query = `
    UPDATE public.users 
    SET 
      bio = $1
    WHERE user_email = $2
    RETURNING *;
  `;

  const values = [bio, email];

  const result = await executeSQLQuery(query, values);
  return result.rows[0];
};

export const updateUserStatus = async (id: string, status: string) => {
  const query = `
    UPDATE public.users 
    SET status = $1 
    WHERE user_id = $2 
    RETURNING *;
  `;
  const values = [status, id];
  const result = await executeSQLQuery(query, values);

  console.log("Update query result:", result.rows);

  return result;
};

export const showStatus = async (id: string): Promise<string | null> => {
  const query = "SELECT status FROM public.users WHERE user_id = $1";
  const values = [id];

  const result = await executeSQLQuery(query, values);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].status;
};

export const getUserById = async (userId: string) => {
  const query = `
    SELECT u.*, 
           t.country, 
           t.price_per_hour, 
           t.specialty, 
           t.degree, 
           t.languages, 
           t.availability, 
           t.rating,
           t.is_active
    FROM public.users u
    LEFT JOIN public.tutors t ON u.user_email = t.tutor_email
    WHERE u.user_id = $1
  `;
  const values = [userId];
  const result = await executeSQLQuery(query, values);
  return result.rows[0];
};

export const verifyUserService = async (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    const result = await executeSQLQuery(
      "UPDATE public.users SET is_verified = true WHERE user_email = $1 RETURNING user_email",
      [decoded.email]
    );
    if (result.rowCount === 0) {
      return { success: false, message: "User not found" };
    }
    return { success: true, message: "Email verified successfully" };
  } catch (err) {
    return { success: false, message: "Invalid or expired token" };
  }
};

export const makeAdmin = async (id: any) => {
  const query =  `
  UPDATE public.users 
  SET type_register = 'admin'
  WHERE user_id = $1
  RETURNING user_id, user_name, user_email, type_register;
`;
  const values = [id];
  const result = await executeSQLQuery(query, values);
  return result.rows[0];
};

export const verifyService = {
  verifyUserPassword: async (userId:any, password:any) => {
    try {
      const result = await executeSQLQuery(
        "SELECT user_password FROM users WHERE user_id = $1",
        [userId]
      );
      if (result.rows.length === 0) return false;
      const hashedPassword = result.rows[0].user_password
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (err) {
      console.error("verifyUserPassword error:", err);
      return false;
    }
  },
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

export const uploadService = {
  uploadPDFToS3: async (file: Express.Multer.File, folder: string) => {


    const params = {
      Bucket: process.env.AWS_BUCKET_PRIVATE!,
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private',
    };

    try {
      const data = await s3.upload(params).promise();
      return data.Location;
    } catch (error) {
      console.error("S3 PDF Upload Error:", error);
      throw new Error("PDF upload failed");
    }
  },

  saveTutorPDF: async (tutorEmail: string, pdfUrl: string, type: string) => {
    const query = `
      INSERT INTO tutor_pdfs (tutor_email, file_url, type)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    try {
      const result = await executeSQLQuery(query, [tutorEmail, pdfUrl, type]);
      return result.rows[0];
    } catch (error) {
      console.error("Error saving PDF URL:", error);
      throw new Error("Saving PDF failed");
    }
  },

  getTutorPDFs: async (tutorEmail: string) => {
    const query = `
      SELECT id, file_url, type, uploaded_at
      FROM tutor_pdfs
      WHERE tutor_email = $1
      ORDER BY uploaded_at DESC
    `;
    const result = await executeSQLQuery(query, [tutorEmail]);

    return result.rows.map((row: any) => {
      const url = new URL(row.file_url);
      const key = decodeURIComponent(url.pathname.slice(1)); 
      return {
        ...row,
        signed_url: getSignedUrlForPDF(key)
      };
    });

  },

  deleteTutorPDF: async (pdfId: string) => {
    const fetchQuery = `SELECT file_url FROM tutor_pdfs WHERE id = $1`;
    const fetchResult = await executeSQLQuery(fetchQuery, [pdfId]);
    const pdf = fetchResult.rows[0];
    if (!pdf) return null;

    const url = new URL(pdf.file_url);
    const key = decodeURIComponent(url.pathname.substring(1));

    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_PRIVATE!,
      Key: key,
    }).promise();

    const deleteQuery = `DELETE FROM tutor_pdfs WHERE id = $1 RETURNING *`;
    const deleteResult = await executeSQLQuery(deleteQuery, [pdfId]);
    return deleteResult.rows[0];
  },
};