import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export function createTRPCContext(options: FetchCreateContextFnOptions) {
  return {
    req: options.req,
    resHeaders: options.resHeaders
  };
}

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;
