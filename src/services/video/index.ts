import { s3, uploadParams } from "../../helpers/index";

export const uploadFileToS3 = async (file:any) => {
    const params:any = uploadParams(file);
    return s3.upload(params).promise();
};



export const listVideosFromS3 = async () => {
    console.log({cc:process.env.AWS_BUCKET_NAME})
    const params:any = { 
      Bucket: process.env.AWS_BUCKET_NAME, 
      Prefix: "videos/"
    };
  
    const { Contents } = await s3.listObjectsV2(params).promise();
  
    return Contents!.map((item) =>
      `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`
    );
  };