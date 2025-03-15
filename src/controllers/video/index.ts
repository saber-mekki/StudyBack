import  {uploadFileToS3,listVideosFromS3}  from "../../services/video/";

export const uploadVideo = async (req:any, res:any) => {
    try {
        if (!req.file) return res.status(400).json({ error: "Aucun fichier envoyé" });

        const result = await uploadFileToS3(req.file);
        res.status(200).json({ fileUrl: result.Location });
    } catch (error:any) {
        res.status(500).json({ error: error.message });
    }
};


export const getVideos = async (req:any, res:any) => {
    try {
      const videoUrls = await listVideosFromS3();
      res.status(200).json(videoUrls);
    } catch (error) {
      console.error("Erreur récupération vidéos :", error);
      res.status(500).json({ error: "Impossible de récupérer les vidéos" });
    }
  };