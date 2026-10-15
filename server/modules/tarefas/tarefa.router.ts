import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../../trpc/init";
import {
  atualizarTarefaInputSchema,
  criarTarefaInputSchema,
  deletarTarefaInputSchema,
  listarTarefasPaginadasInputSchema
} from "./tarefa.input";
import {
  atualizarTarefa,
  criarTarefa,
  deletarTarefa,
  listarTarefas,
  listarTarefasPaginadas
} from "./tarefa.repository";
import { tarefaSchema } from "./tarefa.schema";

const paginaDeTarefasSchema = z.object({
  itens: tarefaSchema.array(),
  proximoCursor: z.string().nullable(),
  total: z.number().int().nonnegative()
});

export const tarefaRouter = createTRPCRouter({
  criar: publicProcedure
    .input(criarTarefaInputSchema)
    .output(tarefaSchema)
    .mutation(({ input }) => criarTarefa(input)),

  listar: publicProcedure
    .output(tarefaSchema.array())
    .query(() => listarTarefas()),

  listarPaginada: publicProcedure
    .input(listarTarefasPaginadasInputSchema)
    .output(paginaDeTarefasSchema)
    .query(({ input }) => listarTarefasPaginadas(input)),

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
