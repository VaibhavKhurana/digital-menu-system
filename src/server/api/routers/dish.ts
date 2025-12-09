import {z} from "zod";
import { createTRPCRouter,publicProcedure } from "../trpc";

export const dishRouter = createTRPCRouter({
  create:publicProcedure
  .input(z.object({
    name: z.string(),
    image: z.string(),
    description:z.string().min(1, "Description is required"),
    spiceLevel:z.number().optional(),
    restaurantId: z.string(),
    categoryIds: z.array(z.string()),
  }))
  .mutation(async({ctx,input})=>{
    const {categoryIds, ...dishData} = input;
    return ctx.db.dish.create({
      data:{
        ...dishData,
        categories:{connect:categoryIds.map((id)=>({id}))},
      },
    });
  }),

  listByRestaurant:publicProcedure.input(z.string())//restaurant id
  .query(async({ctx,input})=>{
    return ctx.db.dish.findMany({
      where:{restaurantId:input},
      include:{categories:true},
    });
  }),
});