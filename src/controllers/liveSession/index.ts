import  { joinSession,startSession, getSessions, endSession } from "../../services/liveSession";

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

export {joinSessionController, createSession, listSessions, closeSession };
