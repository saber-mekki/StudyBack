import { executeSQLQuery } from "../../database";

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
  console.log({nnnn:body.students,kk:!Array.isArray(body.students) ,oo:body.students.length === 0,ggggg:body.groupId})
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
    console.log({results})
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



export const createSession = async ({ group_id, session_date, start_time, end_time, meeting_link }: { group_id: number; session_date: string; start_time: string; end_time: string; meeting_link?: string }) => {
  const query = `
    INSERT INTO group_sessions (group_id, session_date, start_time, end_time, meeting_link)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  try {
    const result = await executeSQLQuery(query, [group_id, session_date, start_time, end_time, meeting_link ?? null]);
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
