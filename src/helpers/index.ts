import jwt from 'jsonwebtoken';
import env from "dotenv";

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
  