import jwt from 'jsonwebtoken';
import env from "dotenv";
import AWS from "aws-sdk";

env.config();

export function jwtTokens(user_id:string, user_name:string, user_email:string ) {
  const user = { user_id, user_name, user_email}; 
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET||"", { expiresIn: '20m' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET||"", { expiresIn: '20d' });
  
  return ({ accessToken, refreshToken });
}

export function authenticateToken(req:any, res:any, next:any) {
    const authHeader = req.headers['authorization']; 
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({error:"Null token"});
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET||"", (error:any, user:any) => {
      if (error) return res.status(403).json({error : error.message});
      req.user = user;
      next();
    });
  }
  

export const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadParams = (file:any) => ({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `videos/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
});
