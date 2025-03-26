import  { uploadVideoToS3, joinSession,startSession, getSessions, endSession } from "../../services/liveSession";
import { s3, uploadParams } from "../../helpers/index";
import { saveVideo } from "../../services/video";

const createSession = async (req: any, res: any) => {
  try {
    const { tutorId } = req.body; 

    if (!tutorId) {
      return res.status(400).json({ error: "Tutor ID is required" });
    }

    const session = await startSession(tutorId); 

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


const listSessions = async (req:any, res:any) => {
  try {
    const sessions = await getSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const closeSession = async (req:any, res:any) => {
  try {
    const { room } = req.body;
    await endSession(room);
    res.json({ message: "Session ended" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const joinSessionController = async (req: any, res: any) => {
  try {
    const { studentId, room } = req.body;
    console.log({})
    const session = await joinSession(studentId, room);
    
    if (!session) return res.status(404).json({ error: "Invalid invite code" });

    res.json({ message: "Joined session", session });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


const uploadVideo = async (req:any, res:any) => {
  try {


    const { tutorId } = req.body;

    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    
    const result = await uploadVideoToS3(req.file);
    
//to save
    const params :any= uploadParams(req.file);
    s3.upload(params, async (err:any, data:any) => {
      if (err) return res.status(500).json({ error: "S3 Upload Error" });

      const video = await saveVideo(tutorId, data.Location);
      // res.json({ message: "Video uploaded successfully", video });
    });
    //
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {uploadVideo,joinSessionController, createSession, listSessions, closeSession };
