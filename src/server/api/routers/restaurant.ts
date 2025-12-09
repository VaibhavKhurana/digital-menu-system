import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const restaurantRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        location: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if(!ctx.userId) throw new Error("Unauthorized");
      return ctx.db.restaurant.create({
        data:{
        name:input.name,
        location:input.location,
        userId:ctx.userId!,
        }
      });
    }),

  getByUser: protectedProcedure
    .query(async ({ ctx }) => {
      if(!ctx.userId) throw new Error("Not authenticated");

      return ctx.db.restaurant.findMany({
        where: { userId: ctx.userId! },
        include: {
          categories: true,
          dishes: true, 
        },
      });
    }),

  getById: protectedProcedure
    .input(z.string()) // restaurantId
    .query(async ({ ctx, input }) => {
      return ctx.db.restaurant.findUnique({
        where: { id: input },
        include: {
          categories: {
            include: {
              dishes: true, 
            },
          },
          dishes: {
            include: {
              categories: true, 
            },
          },
        },
      });
    }),
});
