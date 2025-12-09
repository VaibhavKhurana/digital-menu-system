import {z} from "zod";
import { createTRPCRouter,publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  create: publicProcedure.input(
    z.object({
      name:z.string(),
      restaurantId: z.string(),
    })
  )
  .mutation(async({ctx,input})=>{
    return ctx.db.category.create({
      data:input,
    });
  }),

  listByRestaurant:publicProcedure.input(z.string()) // restaurantId
  .query(async({ctx,input})=>{
    return ctx.db.category.findMany({
      where:{restaurantId:input},
      include:{dishes:true},
    })
  })
})