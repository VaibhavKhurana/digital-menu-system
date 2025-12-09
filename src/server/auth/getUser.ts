import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export const getCurrentUserId = async () =>{
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if(!token) return null;

  try{
    const decoded = verifyToken(token);
    return decoded.userId as string;
  }catch(err){
    return null;
  }
}