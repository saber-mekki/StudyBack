import { Request, Response } from "express";
import * as groupService from "../../services/groups";

export const createGroupController = async (req: Request, res: Response) => {
  try {
    const group = await groupService.createGroup(req.body);
    res.status(201).json(group);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroupsController = async (_req: Request, res: Response) => {
  try {
    const groups = await groupService.getGroups();
    res.json(groups);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroupByIdController = async (req: Request, res: Response) => {
  try {
    const group = await groupService.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroupsByStudentController = async (req: Request, res: Response) => {
  try {
    const groups = await groupService.getGroupsByStudent(req.params.student_id);
    res.json(groups);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addStudentToGroupController = async (req: Request, res: Response) => {
  try {
    const student = await groupService.addStudentToGroup(req.body);
    res.status(201).json(student);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroupStudentsController = async (req: Request, res: Response) => {
 
  try {
    const group = await groupService.getGroupStudents(req.params.group_id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const createSessionController = async (req: Request, res: Response) => {
  try {
    const session = await groupService.createSession(req.body);
    res.status(201).json(session);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGroupSessionsController = async (req: Request, res: Response) => {
  try {
    const sessions = await groupService.getGroupSessions(req.params.group_id);
    res.json(sessions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getStudentGroupSessionsController = async (req: Request, res: Response) => {
  try {
    const sessions = await groupService.getStudentGroupSessions(req.params.student_id);
    res.json(sessions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteGroupController = async (req: Request, res: Response) => {
  try {
    const deletedGroup = await groupService.deleteGroup(req.params.id);
    res.json({
      message: "Group deleted successfully",
      group: deletedGroup
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const closeSessionController = async (req: Request, res: Response) => {
  try {
    const session = await groupService.closeSession(req.params.id);
    res.json({ message: "Session closed successfully", session });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const markAttendanceController = async (req: Request, res: Response) => {
//   try {
//     const attendance = await groupService.markAttendance(req.body);
//     res.status(201).json(attendance);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       return res.status(500).json({ error: error.message });
//     }
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const markAttendanceController = async (req: Request, res: Response) => {
  try {
    const { sessionId, studentId, status, joinedAt, leftAt } = req.body;

    const attendance = await groupService.markAttendance({
      session_id: sessionId,
      student_id: studentId,
      status,
      joined_at: joinedAt || null,
      left_at: leftAt || null,
    });

    res.status(201).json(attendance);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getSessionAttendanceController = async (req: Request, res: Response) => {
  try {
    const attendance = await groupService.getSessionAttendance(req.params.session_id);
    res.json(attendance);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getGroupAttendanceController = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const attendance = await groupService.getGroupAttendance(groupId);
    res.status(200).json(attendance);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add/Update session note
export const addSessionNoteController = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { session_note } = req.body;

    if (!session_note) {
      return res.status(400).json({ error: "session_note is required" });
    }

    const updatedSession = await groupService.addSessionNote(sessionId, session_note);
    res.status(200).json(updatedSession);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const updateStudentNoteController = async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const { sessionId, note } = req.body;

  try {
    const updated = await groupService.updateStudentNote({ sessionId, studentId, note });
    res.status(200).json(updated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
