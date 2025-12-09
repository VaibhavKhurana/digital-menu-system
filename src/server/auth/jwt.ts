import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;
if (!SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}

export function signToken(payload:object){
  return jwt.sign(payload,SECRET,{expiresIn:"7d"});
}

export function verifyToken(token: string){
  return jwt.verify(token,SECRET) as any;
}