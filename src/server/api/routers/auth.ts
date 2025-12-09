import {z} from "zod";
import { createTRPCRouter,publicProcedure } from "../trpc";
import {addMinutes} from "date-fns";
import bcrypt from "bcryptjs";
import { signToken } from "~/server/auth/jwt";
import { resend } from "~/server/email";

export const authRouter = createTRPCRouter({
  sendOTP:publicProcedure.input(z.object({email:z.string().email()})).mutation(async({ctx,input})=>{
    const code = Math.floor(100000+Math.random()*900000).toString();
    console.log("Test OTP:",code);
    const hash = await bcrypt.hash(code,10);
    await ctx.db.oTP.create({
      data:{
        email:input.email,
        code:hash,
        expiresAt:addMinutes(new Date(),5),
      },
    });
    await resend.emails.send({
      from:"Restaurant Manager <onboarding@resend.dev>",
      to:input.email,
      subject:"Login OTP",
      html:`<div style="font-family: Arial; font-size: 16px;">
      <p>Your login OTP is:</p>
      <h1 style="letter-spacing: 4px;">${code}</h1>
      <p>This code is valid for 5 minutes.</p>
      </div>
    `,
    });
    return {success:true,otp:code};
  }),
  verifyOTP:publicProcedure.input(z.object({
    email:z.string().email(),
    code:z.string(),
  })).mutation(async({ctx,input})=>{
    const otp=await ctx.db.oTP.findFirst({
      where:{
        email:input.email,
        expiresAt:{gt:new Date()},
      },
    });
    if(!otp){
      throw new Error("Invalid or expired OTP");
    }
    const match = await bcrypt.compare(input.code,otp.code);

    if(!match) throw new Error("Invalid OTP");

    await ctx.db.oTP.delete({where:{id:otp.id}});

    let user = await ctx.db.user.findUnique({
      where: {email: input.email},
    });

    if(!user){
      user = await ctx.db.user.create({
        data:{email:input.email},
      });
    }

    const token = signToken({userId:user.id});
    
    return {user,token};
  }),
});