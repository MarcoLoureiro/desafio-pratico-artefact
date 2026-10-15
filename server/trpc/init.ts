import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod";

import type { TRPCContext } from "./context";

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const zodError =
      error.cause instanceof ZodError ? z.flattenError(error.cause) : null;

    return {
      ...shape,
      message: zodError ? "Dados de entrada inválidos." : shape.message,
      data: {
        ...shape.data,
        zodError
      }
    };
  }
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
