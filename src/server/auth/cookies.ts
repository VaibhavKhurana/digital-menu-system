"use server";

import { cookies } from "next/headers";
import { api } from "~/trpc/server";

export async function verifyOtpAction(email:string,code:string){
  const result = await api.auth.verifyOTP({email,code});
  (await cookies()).set("token",result.token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    path:"/",
    maxAge:60*60*24*7,
  });
  return result.user;
}