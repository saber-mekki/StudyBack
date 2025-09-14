import { executeSQLQuery } from "../../database";
import AWS from "aws-sdk";
import { URL } from "url";



export const createGroup = async ({
  name,
  description,
  tutor_id,
  schedule_mode,
  daily_start,
  daily_end,
  range_start_date,
  range_end_date
}: {
  name: string;
  description?: string;
  tutor_id: number;
  schedule_mode: string;
  daily_start?: string;
  daily_end?: string;
  range_start_date?: string;
  range_end_date?: string;
}) => {
  const query = `
    INSERT INTO groups (
      name, description, tutor_id, schedule_mode, daily_start, daily_end, range_start_date, range_end_date
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
  `;
  const values = [
    name,
    description ?? null,
    tutor_id,
    schedule_mode,
    daily_start ?? null,
    daily_end ?? null,
    range_start_date ?? null,
    range_end_date ?? null
  ];
  try {
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating group: " + error);
  }
};


export const getGroups = async () => {
  const query = `
    SELECT g.*, u.full_name AS tutor_name
    FROM groups g
    JOIN users u ON g.tutor_id = u.id
  `;
  try {
    const result = await executeSQLQuery(query);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching groups: " + error);
  }
};

export const getGroupById = async (id: any) => {
  const query = `
  SELECT 
    g.id AS group_id,
    g.name,
    g.description,
    g.tutor_id,
    g.schedule_mode ,
    g.daily_start ,
    g.daily_end ,
    g.range_start_date ,
    g.range_end_date ,
    u.user_name AS tutor_name,
    COUNT(gs.student_id) AS student_count
  FROM groups g
  JOIN users u ON g.tutor_id = u.user_id
  LEFT JOIN group_students gs ON gs.group_id = g.id
  WHERE g.tutor_id = $1
  GROUP BY g.id, u.user_name
  ORDER BY g.name;
`;
  try {
    const result = await executeSQLQuery(query, [id]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching tutor groups: " + error);
  }
};


export const addStudentToGroup = async (body: any) => {
  const query = `
    INSERT INTO group_students (group_id, student_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  console.log({ nnnn: body.students, kk: !Array.isArray(body.students), oo: body.students.length === 0, ggggg: body.groupId })
  if (!body.groupId) {
    throw new Error("groupId is required");
  }

  if (!Array.isArray(body.students) || body.students.length === 0) {
    throw new Error("students array is required and must not be empty");
  }

  try {

    const promises = body.students.map((studentId: any) =>
      executeSQLQuery(query, [body.groupId, studentId])
    );
    const results = await Promise.all(promises);
    console.log({ results })
    return results.map(r => r.rows[0]);
  } catch (error) {
    throw new Error("Error adding student to group: " + error);
  }
};

export const getGroupStudents = async (id: any) => {
  const groupQuery = `
    SELECT 
      g.id AS group_id,
      g.name,
      g.description,
      g.schedule_mode,
      g.daily_start,
      g.daily_end,
      g.range_start_date,
      g.range_end_date,
      u.user_name AS tutor_name
    FROM groups g
    JOIN users u ON g.tutor_id = u.user_id
    WHERE g.id = $1
  `;

  const studentsQuery = `
    SELECT u.user_id, u.user_name, u.user_email,u.bio
    FROM group_students gs
    JOIN users u ON gs.student_id = u.user_id
    WHERE gs.group_id = $1
  `;

  const groupResult = await executeSQLQuery(groupQuery, [id]);
  const studentsResult = await executeSQLQuery(studentsQuery, [id]);

  if (groupResult.rows.length === 0) return null;

  return {
    ...groupResult.rows[0],
    students: studentsResult.rows
  };
};



export const createSession = async ({
  group_id,
  session_date,
  start_time,
  end_time,
  meeting_link,
  status
}: {
  group_id: any;
  session_date: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  status: any;
}) => {
  const query = `
    INSERT INTO group_sessions (group_id, session_date, start_time, end_time, meeting_link, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  try {
    const result = await executeSQLQuery(query, [
      group_id,
      session_date,
      start_time,
      end_time,
      meeting_link ?? null,
      status
    ]);
    const studentsQuery = `
    SELECT u.user_id, u.user_name, u.user_email,u.bio
    FROM group_students gs
    JOIN users u ON gs.student_id = u.user_id
    WHERE gs.group_id = $1
  `;
    const studentsRes = await executeSQLQuery(
      studentsQuery,
      [group_id]
    );
    const message = `A new live session has been created!`;
    for (const student of studentsRes.rows) {
      await executeSQLQuery(
        `INSERT INTO notifications (user_id, type, message)
         VALUES ($1, $2, $3)`,
        [student.user_id, 'session_created', message]
      );
    }

    return result.rows[0];
  } catch (error) {
    throw new Error("Error creating session: " + error);
  }
};


export const getGroupSessions = async (group_id: any) => {
  const query = `
    SELECT *
    FROM group_sessions
    WHERE group_id = $1
    ORDER BY session_date ASC
  `;
  try {
    const result = await executeSQLQuery(query, [group_id]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching group sessions: " + error);
  }
};

export const getGroupsByStudent = async (student_id: string) => {
  const query = `
    SELECT g.*
    FROM groups g
    INNER JOIN group_students gs ON gs.group_id = g.id
    WHERE gs.student_id = $1
  `;
  const result = await executeSQLQuery(query, [student_id]);
  return result.rows;
};


export const getStudentGroupSessions = async (student_id: string) => {
  const query = `
    SELECT gs.*
    FROM group_sessions gs
    INNER JOIN groups g ON gs.group_id = g.id
    INNER JOIN group_students s ON s.group_id = g.id
    WHERE s.student_id = $1
    ORDER BY gs.session_date ASC, gs.start_time ASC
  `;
  try {
    const result = await executeSQLQuery(query, [student_id]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching student sessions: " + error);
  }
};

export const deleteGroup = async (id: any) => {
  const query = `
    DELETE FROM groups
    WHERE id = $1
    RETURNING *
  `;
  try {
    const result = await executeSQLQuery(query, [id]);
    if (result.rows.length === 0) {
      throw new Error("Group not found");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Error deleting group: " + error);
  }
};

export const closeSession = async (sessionId: any) => {
  const query = `
    UPDATE group_sessions
    SET status = 'closed'
    WHERE id = $1
    RETURNING *
  `;
  try {
    const result = await executeSQLQuery(query, [sessionId]);
    if (result.rows.length === 0) {
      throw new Error("Session not found");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Error closing session: " + error);
  }
};

export const markAttendance = async ({
  session_id,
  student_id,
  status,
  joined_at,
  left_at
}: {
  session_id: string; // UUID
  student_id: string; // UUID
  status: "present" | "absent" | "late";
  joined_at?: Date;
  left_at?: Date;
}) => {
  const query = `
    INSERT INTO session_attendance (session_id, student_id, status, joined_at, left_at)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (session_id, student_id)
    DO UPDATE SET 
      status = EXCLUDED.status,
      joined_at = COALESCE(EXCLUDED.joined_at, session_attendance.joined_at),
      left_at = COALESCE(EXCLUDED.left_at, session_attendance.left_at),
      time_spent = CASE 
        WHEN EXCLUDED.left_at IS NOT NULL AND EXCLUDED.joined_at IS NOT NULL
          THEN (EXCLUDED.left_at - EXCLUDED.joined_at)
        ELSE session_attendance.time_spent
      END
    RETURNING *;
  `;

  const values = [session_id, student_id, status, joined_at || null, left_at || null];

  try {
    const result = await executeSQLQuery(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error("Error marking attendance: " + error);
  }
};

export const getSessionAttendance = async (session_id: any) => {
  const query = `
    SELECT 
      u.user_id AS student_id,
      u.user_name AS name,
      sa.status,
      sa.joined_at,
      sa.left_at,
      sa.time_spent,
      gsess.start_time,
      gsess.end_time,
      gsess.session_note,
      sa.note
    FROM users u
    LEFT JOIN session_attendance sa
      ON u.user_id = sa.student_id AND sa.session_id = $1
    INNER JOIN group_students gs 
      ON gs.student_id = u.user_id
    INNER JOIN group_sessions gsess
      ON gsess.id = $1
    WHERE gs.group_id = gsess.group_id
      AND u.type_register = 'student';
  `;

  try {
    const result = await executeSQLQuery(query, [session_id]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching session attendance: " + error);
  }
};

export const getGroupAttendance = async (groupId: string) => {
  const query = `
    SELECT 
      u.user_id,
      u.user_name,
      gsess.id AS session_id,
      gsess.session_date,
      gsess.session_note,
      COUNT(sa.id) FILTER (WHERE sa.status = 'present') AS present_count,
      COUNT(sa.id) FILTER (WHERE sa.status = 'absent') AS absent_count,
      COUNT(sa.id) FILTER (WHERE sa.status = 'late') AS late_count,
      COUNT(sa.id) AS total_records
    FROM group_students gs
    JOIN users u ON u.user_id = gs.student_id
    JOIN group_sessions gsess ON gsess.group_id = gs.group_id
    LEFT JOIN session_attendance sa 
      ON sa.student_id = gs.student_id
      AND sa.session_id = gsess.id
    WHERE gs.group_id = $1
    GROUP BY u.user_id, u.user_name, gsess.id, gsess.session_date, gsess.session_note
    ORDER BY gsess.session_date, u.user_name;
  `;
  const result = await executeSQLQuery(query, [groupId]);
  return result.rows;
};

export const addSessionNote = async (sessionId: string, session_note: string) => {
  const query = `
    UPDATE group_sessions
    SET session_note = $1
    WHERE id = $2
    RETURNING *
  `;
  const values = [session_note, sessionId];

  try {
    const result = await executeSQLQuery(query, values);
    if (result.rows.length === 0) {
      throw new Error("Session not found");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating session note: " + error);
  }
};

export const updateStudentNote = async ({
  sessionId,
  studentId,
  note
}: {
  sessionId: string;
  studentId: string;
  note: string;
}) => {
  const query = `
    UPDATE session_attendance
    SET note = $1
    WHERE session_id = $2 AND student_id = $3
    RETURNING *
  `;
  const values = [note, sessionId, studentId];

  try {
    const result = await executeSQLQuery(query, values);
    if (result.rows.length === 0) {
      throw new Error("Attendance record not found");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Error updating note: " + error);
  }


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
    Expires: 60 * 5 // 5 minutes
  };
  return s3.getSignedUrl('getObject', params);
};

export const uploadService = {
  uploadPDFToS3: async (file: Express.Multer.File) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_PRIVATE!,
      Key: `sessions/${Date.now()}-${file.originalname}`,
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

  saveSessionPDF: async (sessionId: string, pdfUrl: string) => {
    const query = `
      INSERT INTO session_pdfs (session_id, file_url)
      VALUES ($1, $2)
      RETURNING *
    `;
    try {
      const result = await executeSQLQuery(query, [sessionId, pdfUrl]);
      return result.rows[0];
    } catch (error) {
      console.error("Error saving PDF URL:", error);
      throw new Error("Saving PDF failed");
    }
  },

  deleteSessionPDF: async (pdfId: string) => {

    const fetchQuery = `SELECT file_url FROM session_pdfs WHERE id = $1`;
    const fetchResult = await executeSQLQuery(fetchQuery, [pdfId]);
    const pdf = fetchResult.rows[0];
    if (!pdf) return null;


    const url = new URL(pdf.file_url);
    const key = decodeURIComponent(url.pathname.substring(1));


    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    }).promise();


    const deleteQuery = `DELETE FROM session_pdfs WHERE id = $1 RETURNING *`;
    const deleteResult = await executeSQLQuery(deleteQuery, [pdfId]);

    return deleteResult.rows[0];
  },




  getSessionPDFs: async (sessionId: string) => {
    const query = `
      SELECT id, file_url, uploaded_at
      FROM session_pdfs
      WHERE session_id = $1
      ORDER BY uploaded_at DESC
    `;
    const result = await executeSQLQuery(query, [sessionId]);
      return result.rows.map((row: any) => {
        const url:any = row.file_url!==null?new URL(row.file_url):"";
        const key = row.file_url!==null?decodeURIComponent(url.pathname.slice(1)):"";
        return {
          ...row,
          signed_url: row.file_url!==null?getSignedUrlForPDF(key):null
        };
      });
   
  },

  uploadVideoToS3: async (file: Express.Multer.File) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_PRIVATE!,
      Key: `sessions/videos/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "private",
    };
    const data = await s3.upload(params).promise();
    return data.Location;
  },
  
  saveSessionVideo: async (sessionId: string, videoUrl: string) => {
    const query = `
      INSERT INTO session_videos (session_id, file_url)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await executeSQLQuery(query, [sessionId, videoUrl]);
    return result.rows[0];
  },
  
};

