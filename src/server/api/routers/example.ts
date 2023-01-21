import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  //This one works as no input present at all
  working1: publicProcedure.query(async ({ ctx }) => {
    const e = await ctx.prisma.example.findFirstOrThrow();
    //e autocompletes createdAt
    const createdAt = e.createdAt;
    return e;
  }),

  working2: publicProcedure.query(async ({ ctx, input }) => {
    const e = await ctx.prisma.example.findFirstOrThrow();
    //e autocompletes createdAt, e typed properly
    const createdAt = e.createdAt;
    return "c";
  }),

  working3: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const e = await ctx.prisma.example.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
      //e does autocomplete createdAt because e is not returned
      const createdAt = e.createdAt;
      return "hi";
    }),

  notWorking1: publicProcedure.query(async ({ ctx, input }) => {
    const e = await ctx.prisma.example.findFirstOrThrow();
    //e does not autocomplete createdAt,
    const createdAt = e.createdAt;
    return e;
  }),

  notWorking2: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const e = await ctx.prisma.example.findFirstOrThrow();
      //e does not autocomplete createdAt
      const createdAt = e.createdAt;
      return e;
    }),

  notWorking3: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const e = await ctx.prisma.example.findFirstOrThrow();
      //e does not autocomplete createdAt
      const createdAt = e.createdAt;
      return e;
    }),

  notWorking4: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const e = await ctx.prisma.example.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
      //e does not autocomplete createdAt
      const created = e.createdAt;
      return e;
    }),
});
