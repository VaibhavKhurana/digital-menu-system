import { createTRPCRouter,protectedProcedure } from "../trpc";
import {z} from "zod";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async({ctx})=>{
    return ctx.db.user.findUnique({
      where:{id:ctx.userId},
      select:{
        id:true,
        name:true,
        email:true,
        country:true,
      }
    });
  }),
  logout:protectedProcedure.mutation(async({ctx})=>{
    ctx.cookies.delete("token");
    return {success:true};
  }),
  updateProfile:protectedProcedure.input(z.object({
    name:z.string().min(1),
    country:z.string().min(1),
  })).mutation(async ({ctx,input})=>{
    return ctx.db.user.update({
      where:{id:ctx.userId},
      data:{
        name:input.name,
        country:input.country,
      },
    });
  }),
});