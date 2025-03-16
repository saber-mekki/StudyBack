import { s3, uploadParams } from "../../helpers/index";
import { executeSQLQuery } from "../../database";

export const uploadFileToS3 = async (file:any) => {
    const params:any = uploadParams(file);
    return s3.upload(params).promise();
};



export const listVideosFromS3 = async () => {
    const params:any = { 
      Bucket: process.env.AWS_BUCKET_NAME, 
      Prefix: "videos/"
    };
    const { Contents } = await s3.listObjectsV2(params).promise();
    return Contents!.map((item) =>
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`
    );
  };



///real code

  export const saveVideo = async (userId:any, videoUrl:any) => {
    const result = await executeSQLQuery(
      "INSERT INTO videos (user_id, video_url) VALUES ($1, $2) RETURNING *",
      [userId, videoUrl]
    );
    return result.rows[0];
  };
  
  export const getVideosByUser = async (userId:any) => {
    const result = await executeSQLQuery("SELECT * FROM videos WHERE user_id = $1", [userId]);
    return result.rows;
  };