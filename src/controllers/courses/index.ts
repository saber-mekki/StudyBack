import { CreateCourse, GetAllCourses } from "../../services/courses";
import { Request, Response } from "express";

export const CreateCourseController = async (req: Request, res: Response) => {
  try {
    const {
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
      tutor_email,

    } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await CreateCourse(
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
      tutor_email,

    );

    res.status(201).json({ message: "Course created successfully!" });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Error creating course", error: error instanceof Error ? error.message : error });
  }
};

export const GetAllCoursesController = async (_req: Request, res: Response) => {
  try {
    const result = await GetAllCourses();

    if (!result || !result.rows || result.rows.length === 0) {
      return res.status(404).json({ message: "No courses found." });
    }

    res.status(200).json({ courses: result.rows });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses", error: error instanceof Error ? error.message : error });
  }
};
