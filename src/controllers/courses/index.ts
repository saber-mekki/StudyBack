import {  GetRelatedCourses ,addOrUpdateRatingS,getCourseRatingsS,getUserRatingsS,getCoursesByUserId, AddCourseVideo, CreateCourse, GetAllCourses, AddCoursePdf ,GetCourseById,GetCourseVideos,GetCoursePdfs} from "../../services/courses";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid"; 
import path from "path";
import fs from "fs";
import {} from "../../services/courses";


import { CreatePDF } from "../../services/courses";
import { s3 } from "../../helpers";

export const CreateCourseController = async (req: Request, res: Response) => {
  try {
    const {
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
      tutor_email,
    } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let videosUrl: any = [];
    let pdfUrl: any = [];
    const videoFile = (req.files as any).filter((file: any) => file.fieldname.startsWith('videos') && file);
    const pdfFile = (req.files as any).filter((file: any) => file.fieldname.startsWith('pdf') && file);
    const imageFile = (req.files as any).find((file: any) => file.fieldname === 'image');
    let imageUrl = '';
    if (imageFile) {
      const imageKey = `courses/images/${uuidv4()}-${imageFile.originalname}`;
      const fileBuffer = fs.readFileSync(imageFile.path);
      const uploadImageParams: any = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
        Body: fileBuffer,
        ContentType: imageFile.mimetype,
      };
      const uploadedImage = await s3.upload(uploadImageParams).promise();
      imageUrl = uploadedImage.Location;
    }
    if (req.files && videoFile) {
      const uploadPromises = videoFile.map(async (video: any, index: any) => {
        const videoKey = `courses/videos/${uuidv4()}-${video.originalname}`;
        const fileBuffer = fs.readFileSync(video.path);
        const uploadVideoParams: any = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: videoKey,
          Body: fileBuffer,
          ContentType: video.mimetype,
        };
        const uploadedVideo = await s3.upload(uploadVideoParams).promise();
        return {
          file: uploadedVideo.Location,
          description: req.body.videos[index].description,
        };
      });
      const videoUrl = await Promise.all(uploadPromises);
      videosUrl = videoUrl
    }

    if (req.files && pdfFile) {
      const uploadPromises = pdfFile.map(async (pdf: any, index: any) => {
        const pdfKey = `courses/pdfs/${uuidv4()}-${pdfFile.originalname}`;
        const fileBuffer = fs.readFileSync(pdf.path);
        const uploadPdfParams: any = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: pdfKey,
          Body: fileBuffer,
          ContentType: pdf.mimetype,
        };
        const uploadedPdf = await s3.upload(uploadPdfParams).promise();
        return {
          file: uploadedPdf.Location,
          description: req.body.pdfs[index].description,
        };
      });
      pdfUrl = await Promise.all(uploadPromises);
    }

    await CreateCourse(
      id,
      tutor_id,
      title,
      category,
      price,
      description,
      imageUrl,
      tutor,
      date,
      level,
      duration,
      language,
      syllabus,
      requirements,
      tutor_email
    )

    if (videosUrl && videosUrl.length > 0) {
      await Promise.all(
        videosUrl.map(async (video: any) => {
          await AddCourseVideo(id, video.file, video.description);
        })
      );
    }
    if (pdfUrl && pdfUrl.length > 0) {
      await Promise.all(
        pdfUrl.map(async (video: any) => {
          await AddCoursePdf(id, video.file, video.description);
        })
      );
    }
    res.status(201).json({ message: "Course created successfully!" });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({
        message: "Error creating course",
        error: error instanceof Error ? error.message : error,
      });
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
    res
      .status(500)
      .json({
        message: "Error fetching courses",
        error: error instanceof Error ? error.message : error,
      });
  }
};


export const GetCourseByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const course = await GetCourseById(id); 

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }


    const videos = await GetCourseVideos(id); 
    const pdfs = await GetCoursePdfs(id);    

    res.status(200).json({
      ...course,
      videos,
      pdfs,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      message: "Error fetching course",
      error: error instanceof Error ? error.message : error,
    });
  }
};


export const CreatePDFController = async (req: Request, res: Response) => {
  try {
    const { course_id } = req.body;
    const pdfFile = req.body;

    if (!course_id || !pdfFile) {
      return res.status(400).json({ message: "Missing course_id or PDF file" });
    }

    const pdfUrl = `/uploads/${pdfFile.filename}`;

    const savedPdf = await CreatePDF(course_id, pdfUrl);

    res
      .status(201)
      .json({ message: "PDF uploaded successfully", pdf: savedPdf });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res
      .status(500)
      .json({
        message: "Error uploading PDF",
        error: error instanceof Error ? error.message : error,
      });
  }
};


export const getCoursesByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const courses = await getCoursesByUserId(id);
    res.status(200).json({ error: false, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error" });
  }
};

export const addOrUpdateRating = async (req: Request, res: Response) => {
  try {
    const { userId, courseId, rating, comment } = req.body;
    const result = await addOrUpdateRatingS(userId, courseId, rating, comment);
    res.json({ message: "Rating submitted", rating: result });
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

export const getCourseRatings = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const result = await getCourseRatingsS(courseId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await getUserRatingsS(userId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const GetRelatedCoursesController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await GetCourseById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const relatedCourses = await GetRelatedCourses(id, course.category);
    res.status(200).json({ relatedCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching related courses" });
  }
};