import type { z } from "zod";

import { tarefaSchema } from "./tarefa.schema";

export const criarTarefaInputSchema = tarefaSchema.pick({
  titulo: true,
  descricao: true
});

export type CriarTarefaInput = z.infer<typeof criarTarefaInputSchema>;

export const atualizarTarefaInputSchema = tarefaSchema
  .pick({
    id: true,
    titulo: true,
    descricao: true
  })
  .partial({
    titulo: true,
    descricao: true
  })
  .refine(
    ({ titulo, descricao }) =>
      titulo !== undefined || descricao !== undefined,
    { message: "Informe ao menos um campo para atualizar." }
  );

export type AtualizarTarefaInput = z.infer<
  typeof atualizarTarefaInputSchema
>;
