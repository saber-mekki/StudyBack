import { Request, Response } from "express";
import * as groupService from "../../services/groups";

export const createGroupController = async (req: Request, res: Response) => {
  try {
    console.log({cc:req.body})
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
    const sessions = await groupService.getGroupSessions(Number(req.params.group_id));
    res.json(sessions);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
