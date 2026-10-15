import { createTRPCRouter, publicProcedure } from "../../trpc/init";
import { criarTarefaInputSchema } from "./tarefa.input";
import { criarTarefa, listarTarefas } from "./tarefa.repository";
import { tarefaSchema } from "./tarefa.schema";

export const tarefaRouter = createTRPCRouter({
  criar: publicProcedure
    .input(criarTarefaInputSchema)
    .output(tarefaSchema)
    .mutation(({ input }) => criarTarefa(input)),
  listar: publicProcedure
    .output(tarefaSchema.array())
    .query(() => listarTarefas()),
});
