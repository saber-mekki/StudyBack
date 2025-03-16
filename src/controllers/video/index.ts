import  {saveVideo, getVideosByUser ,uploadFileToS3,listVideosFromS3}  from "../../services/video/";
import { s3, uploadParams } from "../../helpers/index";

export const uploadVideoTest = async (req:any, res:any) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Aucun fichier envoyé" });

        const result = await uploadFileToS3(req.file);
        res.status(200).json({ fileUrl: result.Location });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
};


export const getVideosTest = async (req:any, res:any) => {
    try {
      const videoUrls = await listVideosFromS3();
      res.status(200).json(videoUrls);
    } catch (error) {
      console.error("Erreur récupération vidéos :", error);
      res.status(500).json({ error: "Impossible de récupérer les vidéos" });
    }
  };



///real code

 export  const uploadVideo = async (req:any, res:any) => {
    if (!req.file) return res.status(400).json({ error: "No video uploaded" });
  
    try {
      const userId = req.user.user_id;
      const params :any= uploadParams(req.file);
  
      s3.upload(params, async (err:any, data:any) => {
        if (err) return res.status(500).json({ error: "S3 Upload Error" });
  
        const video = await saveVideo(userId, data.Location);
        res.json({ message: "Video uploaded successfully", video });
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  
  export const getUserVideos = async (req:any, res:any) => {
    try {
      const userId = req.user.user_id;
      const videos = await getVideosByUser(userId);
      res.json({ videos });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving videos" });
    }
  };