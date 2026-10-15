import { tarefaRouter } from "../modules/tarefas/tarefa.router";
import { createTRPCRouter } from "./init";

export const appRouter = createTRPCRouter({
  tarefa: tarefaRouter
});

export type AppRouter = typeof appRouter;
