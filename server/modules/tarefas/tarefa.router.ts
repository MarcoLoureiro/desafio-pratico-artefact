import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "../../trpc/init";
import {
  atualizarTarefaInputSchema,
  criarTarefaInputSchema,
  deletarTarefaInputSchema
} from "./tarefa.input";
import {
  atualizarTarefa,
  criarTarefa,
  deletarTarefa,
  listarTarefas
} from "./tarefa.repository";
import { tarefaSchema } from "./tarefa.schema";

export const tarefaRouter = createTRPCRouter({
  criar: publicProcedure
    .input(criarTarefaInputSchema)
    .output(tarefaSchema)
    .mutation(({ input }) => criarTarefa(input)),

  listar: publicProcedure
    .output(tarefaSchema.array())
    .query(() => listarTarefas()),

  atualizar: publicProcedure
    .input(atualizarTarefaInputSchema)
    .output(tarefaSchema)
    .mutation(({ input }) => {
      const tarefa = atualizarTarefa(input);

      if (!tarefa) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada."
        });
      }

      return tarefa;
    }),

  deletar: publicProcedure
    .input(deletarTarefaInputSchema)
    .output(tarefaSchema)
    .mutation(({ input }) => {
      const tarefa = deletarTarefa(input);

      if (!tarefa) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tarefa não encontrada."
        });
      }
      return tarefa;
    })
    
});
