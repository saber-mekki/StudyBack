import { Request, Response } from "express";
import {
    createBlog,
    GetAllBlogs,
    createReply
   
  } from "../../services/Blog";
  import { executeSQLQuery } from "../../database";

export const CreateBlogController = async (req: Request, res: Response) => {
  const { title, content, email_user,user_name } = req.body;

  try {
    const blog = await createBlog(title, content, email_user,user_name);

    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      message: "Something went wrong while creating the blog",
      error: error,
    });
  }
};


export const GetAllBlogsController = async (req: Request, res: Response) => {
  try {
    const result = await GetAllBlogs();  

    const blogs = result;

    if (blogs.length === 0) {
      return res.status(404).json({
        message: "No blogs found"
      });
    }

    return res.status(200).json({
      blogs
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message); 
      return res.status(500).json({
        message: "Something went wrong while fetching blogs",
        error: error.message  
      });
    }

    console.error(error);  
    return res.status(500).json({
      message: "An unknown error occurred",
    });
  }
};

export const GetBlogById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: "Blog ID is required" });
      }
  
      const query = `SELECT * FROM blogs WHERE id = $1`;
      const values = [id];
      const result = await executeSQLQuery(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      return res.json({ blog: result.rows[0] }); // 👈 wrapped in "blog"
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error: error });
    }
  };
  
  export const CreateReplicontroller = async (req: Request, res: Response) => {
    const { blog_id, reply_text, email_user } = req.body;
  
    try {
      await createReply(blog_id, reply_text, email_user);
  
      res.status(201).json({
        message: "Reply created successfully",
      });
    } catch (error) {
      console.error("Error creating reply:", error);
      res.status(500).json({
        message: "Something went wrong while creating the replicon",
        error: error,
      });
    }
  };
    export const GetAllRepliController = async (req: Request, res: Response) => {
        try {
        const { id } = req.body;
    
        if (!id) {
            return res.status(400).json({ message: "Blog ID is required" });
        }
    
        const query = `SELECT * FROM replies WHERE blog_id = $1`;
        const values = [id];
        const result = await executeSQLQuery(query, values);
    
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No replies found for this blog" });
        }
    
        return res.json({ replies: result.rows });
        } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error });
        }
    }