import { executeSQLQuery } from "../../database";
import { v4 as uuidv4 } from "uuid";
import { s3, uploadParams } from "../../helpers/index";

const startSession = async (tutorId: any) => {
  if (!tutorId) {
    throw new Error("Tutor ID is required");
  }

  const room = uuidv4(); 
  const inviteLink = `http://localhost:3000/session/${room}`; 

  try {
    const result = await executeSQLQuery(
      "INSERT INTO live_sessions (tutor_id, room, invite_link) VALUES ($1, $2, $3) RETURNING *",
      [tutorId, room, inviteLink]
    );

    return {
      roomId: result.rows[0].room,
      inviteLink: result.rows[0].invite_link,
    };
  } catch (error) {
    console.error("Error starting session:", error);
    throw new Error("Database error");
  }
};

const getSessions = async () => {
  const result = await executeSQLQuery("SELECT * FROM live_sessions WHERE end_time IS NULL");
  return result.rows;
};

const endSession = async (room:any) => {
  await executeSQLQuery("UPDATE live_sessions SET end_time = NOW() WHERE room = $1", [room]);
};

const joinSession = async (studentId: any, room: string) => {
  const result = await executeSQLQuery(
    "UPDATE live_sessions SET student_id = $1 WHERE room = $2 RETURNING *",
    [studentId, room]
  );
  return result.rows[0];
};


const uploadVideoToS3 = async (file:any) => {
  try {
    const uploadResult = await s3.upload(uploadParams(file) as any).promise();
    return { success: true, url: uploadResult.Location };
  } catch (error) {
    console.error("AWS Upload Error:", error);
    throw new Error("Upload failed");
  }
};

export {uploadVideoToS3,joinSession, startSession, getSessions, endSession };


